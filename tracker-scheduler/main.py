from apscheduler.schedulers.background import BlockingScheduler
import requests

scheduler = BlockingScheduler()


def call_weekly():
    try:
        response = requests.get("http://localhost:8000/tasks/weekly")
        if response.status_code == 200:
            print('Weekly Job Done')
    except Exception as e:
        print(e)


scheduler.start()
scheduler.add_job(call_weekly, 'cron', hour=16, minute=48, id='my_weekly_job')


while True:
    print("Scheduler Start")


