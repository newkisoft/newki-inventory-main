import os

for appFolderName in os.listdir("Views"):            
    if  os.path.isdir("Views/"+appFolderName):                
        for subFolder in os.listdir("Views/"+appFolderName):            
            if os.path.isdir("Views/"+appFolderName+"/"+subFolder):                               
                for nodeFolder in os.listdir("Views/"+appFolderName+"/"+subFolder):
                    if nodeFolder.startswith("node_modules"):                                                                
                        os.system("rm -R "+"Views/"+appFolderName+"/"+subFolder+"/"+nodeFolder)