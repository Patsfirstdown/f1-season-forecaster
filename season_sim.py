import fastf1
import pandas as pd
import json
import single_sim
import csv
from datetime import datetime
import copy
import logging
from pathlib import Path

#Stop INFO log during session.load()
logging.disable(logging.INFO)

#compile results into one list
def build_results(result_dict,final_champs):
    for result_data in final_champs:
        driver = result_data['driver']
        pos = result_data['position']

        if driver not in result_dict:
            result_dict[driver] = {}

        if pos not in result_dict[driver]:
            result_dict[driver][pos] = 0

        result_dict[driver][pos] += 1

    return result_dict

#compile next race results into one list
def build_next_gp(result,total_dict):
    for place,driver in result.iterrows():
        pos = driver["Predicted_Finish"]
        drive = driver["Driver"]
        if pd.isna(pos):
            pos = "DNF"
        else:
            pos=int(pos)
        if drive not in total_dict:
            total_dict[drive]={}

        if pos not in total_dict[drive]:
            total_dict[drive][pos]=0
        
        total_dict[drive][pos]+=1
        
    return total_dict

#directory paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"

#create Cache
cache_dir = DATA_DIR / "fastf1_cache"
fastf1.Cache.enable_cache(cache_dir)

#define loop count
n=10000
#prevent long runs during testing
if(n>1000):
    run=input(f"This will take {n/(3.6469174175244152*60)+.209} minutes--run: ")
else:
    run="y"

if(run!="y"):
    raise NameError

#time simulation timing
start_time=datetime.now()

#load driver stats JSON
db=single_sim.load_data()

#load track info
track_names=db["track_metadata"]
current_standings=None
current_year=datetime.now().year
schedule = fastf1.get_event_schedule(current_year)

#track data JSON Path
track_json_path = DATA_DIR / "2026_track_data.json"
#load track data JSON
with open(track_json_path, 'r',encoding='utf-8') as f:
    track_list=json.load(f)

#pull stats from current season
current_standings_base,next_track_base=single_sim.build_current_standings(track_list,current_year)

#establish variables
quali=True
first_loop=True
final_finishes_total={}
next_gp_pred={}
actual_next_gp=None

#begin monte carlo simulations
print("\n\n\nSTARTING LOOP\n\n\n")
#save existing standings
original_base = copy.deepcopy(current_standings_base)
#add another timer
mid_time=datetime.now()

for i in range(n):
    first=True
    current_standings = copy.deepcopy(current_standings_base)
    #loop through remaining races
    while True:
        #if first race of simulation i pull next_track
        if(first):
            #if first loop check if qualifying happened and pull results
            if(first_loop):
                forecast_quali,next_track,current_standings,quali_exists=single_sim.find_next_gp(track_list,current_year,current_standings,use_live_time=False,next_track=next_track_base,quali=quali)
                first_loop=False
                actual_next_gp=next_track
            #if quali proven to exist for first race use it
            elif(quali_exists):
                print("\n\n\n\nQUALI HAPPENED!!!\n\n\n")
                forecast_quali,next_track,current_standings,quali_exists=single_sim.find_next_gp(track_list,current_year,current_standings,use_live_time=False,next_track=next_track_base,quali=True)
            #else create prediction
            else:
                forecast_quali,next_track,current_standings,quali_exists=single_sim.find_next_gp(track_list,current_year,current_standings,use_live_time=False,next_track=next_track_base,quali=quali)
            quali=False
        #else generate qualifying for next track
        else:
            forecast_quali,next_track,current_standings,ignore=single_sim.find_next_gp(track_list,current_year,current_standings,use_live_time=False,next_track=next_track,quali=quali)
        #if no next race end
        if(forecast_quali is None):
            break
        #make a dictionary out of forecast_quali
        forecast_quali_dict = {entry["driver"]["driver"]: entry["position"] for entry in forecast_quali}

        #find event information for next_track
        track_row = schedule[(schedule['EventName']==next_track)]
        is_sprint=track_row["EventFormat"]

        #check if next_race is a sprint
        if(is_sprint.values[0]=="sprint_qualifying"):
            #predict sprint race result with same qualifying grid and update standings
            sprint_forecast=single_sim.run_race_forecast(next_track, forecast_quali_dict,sprint=True)
            current_standings=single_sim.update_standings(sprint_forecast,current_standings)
            print(f"---SIMULATED {i} {next_track} SPRINT RESULTS---")
            #print(sprint_forecast.to_string(index=False))
        
        #predict race result
        final_forecast = single_sim.run_race_forecast(next_track, forecast_quali_dict)

        if(first):
            #if first race save prediction in overall dict
            next_gp_pred=build_next_gp(final_forecast,next_gp_pred)
        
        print(f"---SIMULATED {i} {next_track} RESULTS---")
        #print(final_forecast.to_string(index=False))

        first=False
        #update standings
        current_standings=single_sim.update_standings(final_forecast,current_standings)
    #calculate final standings
    final_champ=single_sim.calc_rank(current_standings)
    #update overall list with final standings
    final_finishes_total=build_results(final_finishes_total,final_champ)

#make next race DataFrame and index it
single_race=pd.DataFrame(next_gp_pred).fillna(0).astype(int).T
single_race = single_race.reindex(
    columns=list(range(1,23)) + ["DNF"],
    fill_value=0
)

#create DataFrame with probabilities
single_race_pct=single_race.div(single_race.sum(axis=1),axis=0)
#create DataFrame with expected position
sr_expected_pos = sum(
    pos * single_race_pct[pos]
    for pos in range(1, 23)
)
sr_expected_pos_df = pd.DataFrame({
    "Expected_Pos": sr_expected_pos
})

#sort DataFrames
sr_expected_pos_df = sr_expected_pos_df.sort_values(
    "Expected_Pos"
)
single_race_pct_sorted = single_race_pct.loc[
    sr_expected_pos_df.index
]
#print results
print("\n---NEXT RESULTS---")
print(sr_expected_pos_df)
print(single_race_pct_sorted)

#Repeat process with overall standings results
print("\n---OVERALL RESULTS---")
results_df = pd.DataFrame(final_finishes_total).fillna(0).astype(int).T
results_df=results_df.reindex(columns=range(1,23),fill_value=0)

#probability DataFrame
results_df_pct=results_df.div(results_df.sum(axis=1),axis=0)
#Expected Position DataFrame
expected_pos = sum(
    pos * results_df_pct[pos]
    for pos in range(1, 23)
)
expected_pos_df = pd.DataFrame({
    "Expected_Pos": expected_pos
})

#Sorted DataFrames
expected_pos_df = expected_pos_df.sort_values(
    "Expected_Pos"
)
results_df_pct_sorted = results_df_pct.loc[
    expected_pos_df.index
]
#print results
print(expected_pos_df)
print(results_df_pct_sorted)

#save single race results to csv
#if quali happened save to quali special csv for race n
if(quali_exists):
    single_output_file = OUTPUT_DIR / "quali_real"+actual_next_gp+"standings_prob.csv"
#overwise save to base csv for race n
else:
    single_output_file = OUTPUT_DIR / "not_quali"+actual_next_gp+"standings_prob.csv"
#Only if did a full run of 10000+
if(n>9999):
    single_race_pct_sorted.to_csv(single_output_file)

#save overall standings results to csv
#if quali happened save to quali special csv for race n
if(quali_exists):
    overall_output_file = OUTPUT_DIR / "quali_real" + next_track_base + "prediction_prob.csv"
#overwise save to base csv for race n
else:
    overall_output_file = OUTPUT_DIR / "not_quali" + next_track_base + "prediction_prob.csv"
#Only if did a full run of 10000+
if(n>9999):
    results_df_pct_sorted.to_csv(overall_output_file)

#Final timing tallys
end_time=datetime.now()
total_duration=end_time-start_time
start_duration=mid_time-start_time
end_duration=end_time-mid_time
#final duration calculations
total_time=total_duration.total_seconds()
start_mid_time=start_duration.total_seconds()
end_mid_time=end_duration.total_seconds()
#print final duration timings
print(f"\n--total_time--\nseconds: {total_time}\nminutes: {total_time/60}"
      f"\n--start_time--\nseconds: {start_mid_time}\nminutes: {start_mid_time/60}\n"
      f"--end_time--\nseconds: {end_mid_time}\nminutes: {end_mid_time/60}\nrps:{n/end_mid_time}")
