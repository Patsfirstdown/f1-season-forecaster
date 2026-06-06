import json
import numpy as np # pyright: ignore[reportMissingImports]
import fastf1 # pyright: ignore[reportMissingImports]
import pandas as pd # pyright: ignore[reportMissingModuleSource]
import random
from datetime import datetime
from pathlib import Path

#create seed for consistent results over a whole run
random.seed(33)
rng = np.random.default_rng(33)

#Create project Directory Path
BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

#add JSON Path
JSON_DIR = PROJECT_DIR / "json"

#load data from JSON
def load_data(filepath=JSON_DIR / "f1_model_data.json"):
    with open(filepath,'r') as f:
        return json.load(f)

#calculate weighted results for past years at track n
def recency_weighted_finish(history,target_track):
    #if no history then 12
    if not history:
        return 12.0
    #base variables
    total_weight=0
    weighted_sum=0
    #weights
    year_weights ={2025:1.0,2024:0.7,2023:0.4,2022:0.2,2021:0.1}
    #loop through races
    for race in history:
        #if the race has happened calculate value with weight
        if race['Track']==target_track and race['Finish'] is not None:
            weight = year_weights.get(race['Year'],0.1)
            weighted_sum+=race['Finish'] * weight
            total_weight+=weight
    #if weight exist return it scaled to total weight
    if total_weight >0:
        return weighted_sum/total_weight
    return None

#calculate average for similar tracks if no results occur like Madrid 2026
def archetype_fallback(history, track_type, speed_profile):
    matching_finishes = [
        race['Finish'] for race in history
        if race['Track_Type']==track_type
        and race['Speed_Profile']==speed_profile
        and race['Finish'] is not None
    ]
    #if something matches do the math
    if matching_finishes:
        return sum(matching_finishes)/len(matching_finishes)
    return 12.0

#calculate a %dnf based on this season and track history
def calculate_blended_dnf(history, current_form_driver, target_track):
    #find %dnf for track n
    track_dnfs=[race['DNF'] for race in history if race['Track']==target_track]
    track_dnf_rate=sum(track_dnfs)/len(track_dnfs) if track_dnfs else 0.15
    #find current season race count
    total_races = len(current_form_driver)

    if total_races == 0:
        return 0
    
    #find %dnf for this season
    dnfs = sum(race["DNF"] for race in current_form_driver)
    dnfs=dnfs/total_races
    #combine with track weight priority
    return (track_dnf_rate *.6)+(dnfs * 0.4)

#actual forecast function
def run_race_forecast(target_track,simulated_quali_results,sprint=False):
    #load data
    db=load_data()
    #create track variables
    track_meta=db['track_metadata'][target_track]
    overtake_mod=track_meta['Overtaking_Multi']
    track_type=track_meta['Type']
    speed_profile=track_meta['Speed_Profile']
    forecast_records=[]
    #loop through drivers
    for driver,quali_pos in simulated_quali_results.items():
        #pull driver history and current form
        driver_history=db['historical_results'].get(driver,[])
        current_driver_stats=db['current_form'].get(driver,[])
        #find average finish this season
        current_driver_form=average_finish(current_driver_stats)
        #find weighted track history
        hist_finish = recency_weighted_finish(driver_history,target_track)
        #if never raced here(rookie, new track, etc.) find similar tracks
        if hist_finish is None:
            hist_finish = archetype_fallback(driver_history,track_type,speed_profile)
        #calculate race_pace value
        if overtake_mod <.5:
            best_race_pace =(quali_pos*.7)+(hist_finish*.15)+(current_driver_form*.15)
        elif overtake_mod > 1.1:
            best_race_pace =(quali_pos*.3)+(hist_finish*.45)+(current_driver_form*.25)
        else:
            best_race_pace =(quali_pos*.45)+(hist_finish*.35)+(current_driver_form*.20)
        #add random value with size dependent on sprint/race
        if(sprint):
            random_modifier=rng.normal(loc=0.0,scale=.5)
        else:
            random_modifier = rng.normal(loc=0.0,scale=1.5)
        #calculate sim score
        simulated_score=best_race_pace+random_modifier
        #find dnf probablity
        dnf_prob=calculate_blended_dnf(driver_history,current_driver_stats,target_track)
        #predict if driver dnf's
        is_dnf=1 if rng.random()*1.5 <dnf_prob else 0
        #add prediction to forecast
        forecast_records.append({
            'Driver': driver,
            'Quali': quali_pos,
            'Sim_Score': simulated_score if not is_dnf else float('inf'),
            'DNF': is_dnf
        })
    #make DataFrame sorted by sim score
    df_results= pd.DataFrame(forecast_records).sort_values(by="Sim_Score").reset_index(drop=True)
    #if sprint add predicted finish custom
    if(sprint):
        df_results["Predicted_Finish"]="sprint"+(df_results.index+1).astype(float).astype(str)
    #else add as normal
    else:
        df_results["Predicted_Finish"]=df_results.index+1
    #reset DNF to None and return df
    df_results.loc[df_results['DNF']==1,'Predicted_Finish']=None
    return df_results[['Predicted_Finish','Driver','DNF','Quali']]

#generate predictive qualifying
def generate_quali(season_standings):
    mock_quali=[]
    #loop through drivers in driver standings
    for position, driver in enumerate(season_standings,start=1):
        #add random element
        random_factor=random.uniform(-2.5,2.5)
        percieved_pace=position+random_factor
        #add to array
        mock_quali.append({
            "driver":driver,
            "pace_score":position
        })
    #sort by pace score
    mock_quali.sort(key=lambda x: x["pace_score"])
    #return predict position and driver
    return [
        {"position": idx +1, "driver": item["driver"]}
        for idx, item in enumerate(mock_quali)
    ]

#find next grand prix location and qualifying
def find_next_gp(TRACK_REGISTRY,current_year,current_standings,use_live_time=True,next_track=None,quali=True,sprint_yes=False):
    calc=(current_standings==None)
    #generate current standings if they don't exist
    if(calc):
        current_standings={}

    #generate variables
    schedule = fastf1.get_event_schedule(current_year)
    today=datetime.now()
    next_track_name=None
    next_track_attri=None
    #find next_track if not known
    if(next_track==None):
        #loop through tracks from JSON
        for track_name,attributes in TRACK_REGISTRY.items():
            #pull track info
            track_row = schedule[(schedule['EventName']==track_name)]
            is_sprint=track_row["EventFormat"]

            if track_row.empty:
                print(f"Track {track_name} is not found")
                continue
            #if no current standings pull race result and add them
            elif(calc):
                #check if need to find sprint and add all points oppurtunities
                if(is_sprint.values[0]=="sprint_qualifying"):
                    results=fastf1.get_session(current_year,track_row['EventName'].values[0],'R')
                    current_standings=calc_places(current_standings,results)
                    sprint_results=fastf1.get_session(current_year,track_row['EventName'].values[0],'S')
                    current_standings=calc_sprint_places(current_standings,sprint_results)
                else:
                    results=fastf1.get_session(current_year,track_row['EventName'].values[0],'R')
                    current_standings=calc_places(current_standings,results)
                    
            #if using live timing(single race prediction)
            if(use_live_time):
                #check if race has happened
                event_date=track_row["EventDate"].values[0]
                if pd.to_datetime(event_date).to_pydatetime()> today:
                    print(f"{track_name} hasn't happened yet")
                    next_track_name=track_name
                    next_track_attri=attributes
                    break
            elif track_row.empty:
                next_track_name=track_name
                next_track_attri=attributes
                break
    #if next_track is given known
    #technically next_track is last track
    else:
        #find it in schedule
        current_round = schedule.loc[
            schedule["EventName"] == next_track,
            "RoundNumber"
        ].iloc[0]
        #find the following grand prix name
        next_race = schedule.loc[
            schedule["RoundNumber"] == current_round + 1
        ]
        #if there is a next race pull EventName
        if not next_race.empty:
            next_track_name=next_race.iloc[0]["EventName"]
    #if no next track then return None,etc.
    if not next_track_name:
        print("NO RACES LEFT")
        return None, None, current_standings,False
    
    #find offical name
    target_row=schedule[schedule['EventName']==next_track_name]
    official_event_name=target_row['EventName'].values[0]
    #set up qualifying prediction
    grid_4_sim=[]
    #check if sprint weekend
    if(sprint_yes):
        #try to find qualifying results
        try:
            quali_session=fastf1.get_session(current_year,official_event_name,'SQ')
            quali_session.load(telemetry=False,weather=False,messages=False)
            #if they exist add them to grid_4_sim
            if (not quali_session.results.empty and 'Position' in quali_session.results.columns and pd.notna(quali_session.results['Position'].max())):
                print("Quali Has Occured")
                sorted_quali = quali_session.results.sort_values(by='Position')
                for _, row in sorted_quali.iterrows():
                    grid_4_sim.append({
                        "position": int(row['Position']),
                        "driver": row['Abbreviation']
                    })

                return grid_4_sim,next_track_name,current_standings,True
            #else raise error
            else:
                raise ValueError("Quali not done")
        #generate quali results if none exist
        except Exception:
            current_ranks=calc_rank(current_standings)

            grid_4_sim=generate_quali(current_ranks)
            #return the results
            return grid_4_sim,next_track_name,current_standings,False
    #if qualifying is to be checked
    if(quali):
        #try to find results
        try:
            quali_session=fastf1.get_session(current_year,official_event_name,'Q')
            quali_session.load(telemetry=False,weather=False,messages=False)
            print(quali_session.results)
            #if they exist add them to grid_4_sim
            if (not quali_session.results.empty and 'Position' in quali_session.results.columns and pd.notna(quali_session.results['Position'].max())):
                print("Quali Has Occured")
                sorted_quali = quali_session.results.sort_values(by='Position')
                for _, row in sorted_quali.iterrows():
                    grid_4_sim.append({
                        "position": int(row['Position']),
                        "driver": row['Abbreviation']
                    })

                return grid_4_sim,next_track_name,current_standings,True
            #else raise error
            else:
                print("QUALI NOT DONE")
                raise ValueError("Quali not done")
        #generate quali results if none exist
        except Exception:
            current_ranks=calc_rank(current_standings)

            grid_4_sim=generate_quali(current_ranks)
            #return the results
            return grid_4_sim,next_track_name,current_standings,False
    #if it is known there is no qualifying the generate prediction
    else:
        current_ranks=calc_rank(current_standings)

        grid_4_sim=generate_quali(current_ranks)
        #return the results
        return grid_4_sim,next_track_name,current_standings,False

#update current standings with latest results
def calc_places(current_standings,results,real=True):
    #load past results
    results.load(telemetry=False,weather=False,messages=False)
    #add them to current standings
    for Abbreviation, driver_data in results.results.iterrows():
        driver=driver_data['Abbreviation']
        pos=driver_data['Position']

        if driver not in current_standings:
            current_standings[driver]={}

        if pos not in current_standings[driver]:
            current_standings[driver][pos]=0
        
        current_standings[driver][pos]+=1
    return current_standings

#update current standings with sprint results
def calc_sprint_places(current_standings,results,real=True):
    results.load(telemetry=False,weather=False,messages=False)
    #add them to current standings
    for Abbreviation, driver_data in results.results.iterrows():
        driver=driver_data['Abbreviation']
        pos="sprint" + str(driver_data['Position'])

        if driver not in current_standings:
            current_standings[driver]={}

        if pos not in current_standings[driver]:
            current_standings[driver][pos]=0
        
        current_standings[driver][pos]+=1
    return current_standings

#calculate actual standings with FIA rules
def calc_rank(current_standings):
    #FIA points scored per position
    points_scores={1:25,2:18,3:15,4:12,5:10,6:8,7:6,8:4,9:2,10:1,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,
                   "sprint1.0":8,"sprint2.0":7,"sprint3.0":6,"sprint4.0":5,"sprint5.0":4,"sprint6.0":3,"sprint7.0":2,"sprint8.0":1,
                   "sprint9.0":0,"sprint10.0":0,"sprint11.0":0,"sprint12.0":0,"sprint13.0":0,"sprint14.0":0,"sprint15.0":0,"sprint16.0":0,
                   "sprint17.0":0,"sprint18.0":0,"sprint19.0":0,"sprint20.0":0,"sprint21.0":0,"sprint22.0":0}
    championship = []
    #loop through drivers
    for driver, finishes in current_standings.items():
        points = 0
        #loop through finishes and add the corresponding points
        for position, count in finishes.items():
            points += points_scores.get(position, 0) * count
        #update championship
        championship.append({
            "driver": driver,
            "points": points
        })
    #sort by FIA standards
    championship.sort(
        key=lambda x: (
            x["points"],
            *[
                current_standings[x["driver"]].get(pos, 0)
                for pos in range(1, 23)
            ]
        ),
        reverse=True
    )
    #add numbers
    for pos, driver in enumerate(championship, start=1):
        driver["position"] = pos
    #return result
    return championship

#find average finish
def average_finish(driver_history):
    #find all fnishes
    finishes = [
        race["Finish"]
        for race in driver_history
        if race["Finish"] is not None
    ]

    if not finishes:
        return None
    #return average
    return sum(finishes) / len(finishes)

#build current standings from nothing
def build_current_standings(TRACK_REGISTRY,current_year):
    #build variables
    current_standings={}
    schedule = fastf1.get_event_schedule(current_year)
    #loop through tracks
    for track_name,attributes in TRACK_REGISTRY.items():
        #pull track info
        track_row = schedule[(schedule['EventName']==track_name)]
        #if track empty skip
        if track_row.empty:
            print(f"Track {track_name} is not found")
            continue
        else:
            #pull results
            results=fastf1.get_session(current_year,track_row['EventName'].values[0],'R')
            results.load(telemetry=False,weather=False,messages=False)
            #if no results then end
            if(results.results.empty):
                break
            #else update standings
            current_standings=calc_places(current_standings,results)
            next_track=track_name
    #return findings
    return current_standings,next_track

#update standings with new results from season_sim
def update_standings(race_forecast,current_standings):
    #loop through drivers
    for place,driver in race_forecast.iterrows():
        #pull variables
        pos = driver["Predicted_Finish"]
        drive = driver["Driver"]
        #add driver if driver swap occurs
        if drive not in current_standings:
            current_standings[drive]={}
        #add position if new finish position for the driver
        if pos not in current_standings[drive]:
            current_standings[drive][pos]=0
        #increase count by one
        current_standings[drive][pos]+=1
        
    return current_standings

#single race sim
if __name__ == "__main__":
    #create Cache
    CACHE_DIR=PROJECT_DIR / "fastf1_cache"
    fastf1.Cache.enable_cache(CACHE_DIR)

    #build variables
    current_standings=None
    current_year=datetime.now().year

    #pull track list JSON
    with open(JSON_DIR / "2026_track_data.json", 'r',encoding='utf-8') as f:
            track_list=json.load(f)

    #find next grand prix and qualifying
    forecast_quali,next_track,current_standings,_=find_next_gp(track_list,current_year,current_standings)
    #print finish places and standings
    print(current_standings)
    print(calc_rank(current_standings))

    #run actual prediction and print results
    forecast_quali_dict = {entry["driver"]["driver"]: entry["position"] for entry in forecast_quali}
    final_forecast = run_race_forecast(next_track, forecast_quali_dict)
    print("---SIMULATED RESULTS---")
    print(final_forecast.to_string(index=False))