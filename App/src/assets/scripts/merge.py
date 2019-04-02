import csv
import matplotlib.pyplot as plt
import numpy as np
import os
import sys

try:
    inputPath = sys.argv[1]
    startDate = sys.argv[2]
    endDate = sys.argv[3]
    outputPath = sys.argv[4]
except:
    print("arguments help: <input_path> <start_date> <end_date> <output_path>")
    exit()

variableStartIndex = 2

xCount = 0
yCount = 0

csvDataList = list()

def getFieldIndex(headers, fieldName):
    return headers.index(fieldName)

def determineDateInRange(date):
    dateSplit = date.split(sep = "-")
    startDateSplit = startDate.split(sep = "-")
    endDateSplit = endDate.split(sep = "-")
    if dateSplit[0] >= startDateSplit[0] and dateSplit[0] <= endDateSplit[0] and \
        dateSplit[1] >= startDateSplit[1] and dateSplit[1] <= endDateSplit[1] and \
        dateSplit[2] >= startDateSplit[2] and dateSplit[2] <= endDateSplit[2]:
        return True
    else:
        return False

for fileName in os.listdir(inputPath):
    if determineDateInRange(fileName.split(sep = ".")[0]):
        with open(inputPath + "/" + fileName, "r") as outFile:
            reader = csv.reader(outFile)
            ls = list(reader)
            headers = ls.pop(0)

            _xCount = len(set(map(lambda item: float(item[0]), ls)))
            if xCount == 0:
                xCount = _xCount
                print(xCount)
            elif xCount != _xCount:
                print("Files have different x counts, please check.")
                exit()

            _yCount = len(set(map(lambda item: float(item[1]), ls)))
            if yCount == 0:
                yCount = _yCount
                print(yCount)
            elif yCount != _yCount:
                print("Files have different y counts, please check.")
                exit()

            csvDataList.append(ls)

dataDictList = list()
for i in range(xCount * yCount):
    dataDict = dict()
    for col in range(0, len(csvDataList[0][0])):
        temp = list()
        for csvData in csvDataList:
            temp.append(float(csvData[i][col]))
        avg = sum(temp) / len(temp)
        dataDict[headers[col]] = avg
    dataDictList.append(dataDict)
        
os.makedirs(outputPath, exist_ok = True)
outputFilename = os.path.join(outputPath, startDate + "_to_" + endDate + ".csv")
print("Writing to " + outputFilename + "...")
with open(outputFilename, "w", newline = "") as outFile:
    writer = csv.DictWriter(outFile, fieldnames = headers)
    writer.writeheader()
    writer.writerows(dataDictList)
print("Write completed.")