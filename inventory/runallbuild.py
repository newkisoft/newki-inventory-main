import os

for filename in os.listdir():
    if filename.startswith("build") and filename.endswith(".sh"):
        print(filename)
        os.system("sh "+filename)