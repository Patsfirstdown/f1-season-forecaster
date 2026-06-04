import fastf1
import pandas as pd
import json
import os
from datetime import datetime
from pathlib import Path

#create track registry with their attributes
TRACK_REGISTRY = {
    'Australian Grand Prix': {
        'Type': 'Semi-Street',
        'Speed_Profile': 'Medium',
        'Downforce': 'Medium',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':.7
    },
    'Chinese Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'Medium',
        'Downforce': 'Medium',
        'Tire_Wear': 'High',
        'Overtaking_Multi':1.2
    },
    'Japanese Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'High',
        'Tire_Wear': 'High',
        'Overtaking_Multi':.65
    },
    'Miami Grand Prix': {
        'Type': 'Semi-Street',
        'Speed_Profile': 'Medium',
        'Downforce': 'Medium',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.15
    },
    'Canadian Grand Prix': {
        'Type': 'Semi-Street',
        'Speed_Profile': 'Medium',
        'Downforce': 'Low',
        'Tire_Wear': 'High',
        'Overtaking_Multi':.9
    },
    'Monaco Grand Prix': {
        'Type': 'Street',
        'Speed_Profile': 'Low',
        'Downforce': 'Maximum',
        'Tire_Wear': 'Low',
        'Overtaking_Multi':.15
    },
    'Barcelona Grand Prix': {  # FastF1 matches 'Spain' or 'Catalunya' for the Barcelona track
        'Type': 'Permanent',
        'Speed_Profile': 'Medium',
        'Downforce': 'High',
        'Tire_Wear': 'High',
        'Overtaking_Multi':1.1
    },
    'Austrian Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'Medium',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.25
    },
    'British Grand Prix': {  # FastF1 official match name for Silverstone
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'High',
        'Tire_Wear': 'High',
        'Overtaking_Multi':.95
    },
    'Belgian Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'Medium',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.3
    },
    'Hungarian Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'Low',
        'Downforce': 'Maximum',
        'Tire_Wear': 'High',
        'Overtaking_Multi':.75
    },
    'Dutch Grand Prix': {  # Zandvoort
        'Type': 'Permanent',
        'Speed_Profile': 'Medium',
        'Downforce': 'High',
        'Tire_Wear': 'High',
        'Overtaking_Multi':1.05
    },
    'Italian Grand Prix': {  # FastF1 official match name for Monza
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'Minimum',
        'Tire_Wear': 'Low',
        'Overtaking_Multi':1.1
    },
    'Spanish Grand Prix': {  # The new addition
        'Type': 'Semi-Street',
        'Speed_Profile': 'Medium',
        'Downforce': 'Medium',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':.8
    },
    'Azerbaijan Grand Prix': {  # Baku
        'Type': 'Street',
        'Speed_Profile': 'High',
        'Downforce': 'Low',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.05
    },
    'Singapore Grand Prix': {
        'Type': 'Street',
        'Speed_Profile': 'Low',
        'Downforce': 'Maximum',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':.6
    },
    'United States Grand Prix': {  # Circuit of the Americas
        'Type': 'Permanent',
        'Speed_Profile': 'Medium',
        'Downforce': 'High',
        'Tire_Wear': 'High',
        'Overtaking_Multi':1
    },
    'Mexico City Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'Maximum',  # Runs max downforce aero package due to thin altitude air
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.2
    },
    'São Paulo Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'Medium',
        'Downforce': 'High',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.15
    },
    'Las Vegas Grand Prix': {
        'Type': 'Street',
        'Speed_Profile': 'High',
        'Downforce': 'Minimum',
        'Tire_Wear': 'Low',
        'Overtaking_Multi':1.05
    },
    'Qatar Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'High',
        'Downforce': 'High',
        'Tire_Wear': 'Maximum',
        'Overtaking_Multi':.7
    },
    'Abu Dhabi Grand Prix': {
        'Type': 'Permanent',
        'Speed_Profile': 'Medium',
        'Downforce': 'Medium',
        'Tire_Wear': 'Medium',
        'Overtaking_Multi':1.25
    }
}

#directory paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"

#create Cache
cache_dir = DATA_DIR / "fastf1_cache"
fastf1.Cache.enable_cache(cache_dir)

#save track registry to JSON
with open(DATA_DIR / "2026_track_data.json", 'w') as f:
    json.dump(TRACK_REGISTRY, f, indent=4)

#add cache
datafile=DATA_DIR / "f1_model_data.json"

#pull past five years of driver history at current tracks
def driver_track_hist(driver_codes,TRACK_REGISTRY,start_year=2021,end_year=2025,):
    #create master database with track data, past data, current data
    master_database={
        "track_metadata": TRACK_REGISTRY,
        "historical_results":{driver_code: [] for driver_code in driver_codes},
        "current_form":{}
        }
    #loop through the years
    for year in range(start_year,end_year+1):
        print(f"Processing {year}")
        #loop trough the tracks
        for track_name,attributes in TRACK_REGISTRY.items():
            if track_name == 'Madrid' and year <2026:
                continue
            #try to pull that tracks results from year
            try:
                session=fastf1.get_session(year,track_name,'R')
                session.load(telemetry=False,weather=False,messages=False)
                results=session.results

                #loop through drivers
                for driver_code in driver_codes:
                    #pull their result
                    driver_row=results[results['Abbreviation']==driver_code]
                    #check if they raced there
                    if not driver_row.empty:
                        #add the result to variables
                        finish_pos=int(driver_row['Position'].values[0])
                        grid_pos=int(driver_row['GridPosition'].values[0])
                        status=(driver_row['Status'].values[0])
                        #check if they dnf
                        is_dnf=1 if "Finished" not in status and "+1 Lap" not in status and "+2 Lap" not in status and "Lapped" not in status else 0
                        #if they did then add the result with finish as None
                        if(is_dnf==1):
                            master_database["historical_results"][driver_code].append({'Year':year,
                                'Grid':grid_pos,
                                'Finish':None,
                                'DNF':is_dnf,
                                'Track_Type':attributes['Type'],
                                'Speed_Profile':attributes['Speed_Profile'],
                                'Downforce_Req':attributes['Downforce'],
                                'Tire_Wear_Profile':attributes['Tire_Wear'],
                                'Overtaking_Multi':attributes['Overtaking_Multi'],
                                'Track':track_name
                                })
                        #else add all result
                        else:
                            master_database["historical_results"][driver_code].append({'Year':year,
                                'Grid':grid_pos,
                                'Finish':finish_pos,
                                'DNF':is_dnf,
                                'Track_Type':attributes['Type'],
                                'Speed_Profile':attributes['Speed_Profile'],
                                'Downforce_Req':attributes['Downforce'],
                                'Tire_Wear_Profile':attributes['Tire_Wear'],
                                'Overtaking_Multi':attributes['Overtaking_Multi'],
                                'Track':track_name
                                })
                        #print their result
                        print(f"{year} {track_name}: {driver_code} Started {grid_pos}, Finished {finish_pos} ({status})\t{grid_pos-finish_pos}")
                    else:
                        #print they didn't race
                        print(f"{year} {track_name}: {driver_code} did not participate in this race")
            except Exception as e:
                #print if the race didn't occur there then
                print(f"Could not load {year} {track_name}: {e}")
                continue
    #return master database
    return master_database

#pull drivers result for this season
def current_form(driver_codes,TRACK_REGISTRY,current_year):
    #make variables
    current_form_data={driver_code: [] for driver_code in driver_codes}
    schedule = fastf1.get_event_schedule(current_year)
    today=datetime.now()
    #loop through this season
    for track_name,attributes in TRACK_REGISTRY.items():
        #pull track info
        track_row = schedule[(schedule['EventName'].str.contains(track_name, case=False, na=False))]

        if track_row.empty:
            print(f"Track {track_name} is not found")
            continue
        #check if the race has occured
        event_date=track_row["EventDate"].values[0]
        if pd.to_datetime(event_date).to_pydatetime()> today:
            print(f"{track_name} hasn't happened yet")
            break
        if track_name == 'Madrid':
            continue
        #try to pull results
        try:
            session=fastf1.get_session(current_year,track_name,'R')
            session.load(telemetry=False,weather=False,messages=False)

            results=session.results
            #loop through drivers
            for driver_code in driver_codes:
                driver_row=results[results['Abbreviation']==driver_code]
                #if the driver exists
                if not driver_row.empty:
                    #pull results into variables
                    finish_pos=int(driver_row['Position'].values[0])
                    grid_pos=int(driver_row['GridPosition'].values[0])
                    status=(driver_row['Status'].values[0])
                    #check for DNF
                    is_dnf=1 if "Finished" not in status and "+1 Lap" not in status and "+2 Lap" not in status and "Lapped" not in status else 0
                    #if they did then add the result with finish as None
                    if(is_dnf==1):
                        current_form_data[driver_code].append({'Year':current_year,
                            'Grid':grid_pos,
                            'Finish':None,
                            'DNF':is_dnf,
                            'Track_Type':attributes['Type'],
                            'Speed_Profile':attributes['Speed_Profile'],
                            'Downforce_Req':attributes['Downforce'],
                            'Tire_Wear_Profile':attributes['Tire_Wear'],
                            'Overtaking_Multi':attributes['Overtaking_Multi'],
                            'Track':track_name
                            })
                    else:
                    #else add all result
                        current_form_data[driver_code].append({'Year':current_year,
                            'Grid':grid_pos,
                            'Finish':finish_pos,
                            'DNF':is_dnf,
                            'Track_Type':attributes['Type'],
                            'Speed_Profile':attributes['Speed_Profile'],
                            'Downforce_Req':attributes['Downforce'],
                            'Tire_Wear_Profile':attributes['Tire_Wear'],
                            'Overtaking_Multi':attributes['Overtaking_Multi'],
                            'Track':track_name
                            })
                    #print results
                    print(f"{current_year}: {driver_code} Started {grid_pos}, Finished {finish_pos} ({status})\t{grid_pos-finish_pos}")
                else:
                    #print did not race
                    print(f"{current_year}: {driver_code} did not participate in this race")
        except Exception as e:
            print(f"Could not load {current_year} {track_name}: {e}")
            break

    return current_form_data

#update json function
def update_json(datafile,driver_codes,TRACK_REGISTRY,current_year):
    #check if the json exists to prevent long updates
    if os.path.exists(datafile):
        print(f"found existing database")
        #update only this season stats
        with open(datafile, 'r',encoding='utf-8') as f:
            master_database=json.load(f)
            master_database['current_form']=current_form(driver_codes, TRACK_REGISTRY, current_year)
    #create full json
    else:
        master_database=driver_track_hist(driver_codes=driver_registry_df['Abbreviation'],TRACK_REGISTRY=TRACK_REGISTRY,start_year=current_year-5,end_year=current_year-1)
        master_database['current_form']=current_form(driver_codes=driver_registry_df['Abbreviation'],TRACK_REGISTRY=TRACK_REGISTRY,current_year=current_year)

    return master_database

#create variables
current_year=datetime.now().year
session=fastf1.get_session(2026,'Australia','R')
session.load(telemetry=False)
driver_registry_df=session.results[['Abbreviation','FullName','DriverNumber','TeamName']]

#show DataFrame sorted by teamname
print(driver_registry_df.sort_values(by='TeamName'))
#create master database
master_database=update_json(datafile=datafile,driver_codes=driver_registry_df['Abbreviation'],TRACK_REGISTRY=TRACK_REGISTRY,current_year=current_year)

#Save to JSON
print("\nExporting file...")
with open(datafile, 'w') as f:
    json.dump(master_database, f, indent=4)
#show example results
print("'f1_model_data.json' generated")
print(master_database['historical_results']['HAM'])
