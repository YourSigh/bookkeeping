import time

for _ in range(5):
    seconds = time.time()
    days = seconds // (60 * 60 * 24)
    seconds %= (60 * 60 * 24)

    hours = seconds // (60 * 60)
    seconds %= (60 * 60)

    minutes = seconds // 60
    seconds %= 60

    print(f'{days:.0f} days, {hours:.0f} hours, {minutes:.0f} minutes, and {seconds:.2f} seconds have passed since Jan 1, 1970')
