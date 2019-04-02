import csv
import os
import numpy as np
import matplotlib.pyplot as plt
import sys

try:
    inputPath = sys.argv[1]
    outputPath = sys.argv[2]
except:
    print("arguments help: <input_path> <output_path>")
    exit()

def getFieldIndex(headers, fieldName):
    return headers.index(fieldName)

xCount = 0
yCount = 0


for fileName in os.listdir(inputPath):
    with open(inputPath + "/" + fileName, "r") as outFile:
        reader = csv.reader(outFile)
        ls = list(reader)
        headers = ls.pop(0)

        _xCount = len(set(map(lambda item: int(item[0]), ls)))
        if xCount == 0:
            xCount = _xCount
        elif xCount != _xCount:
            print("Files have different x counts, please check.")
            exit()

        _yCount = len(set(map(lambda item: int(item[1]), ls)))
        if yCount == 0:
            yCount = _yCount
        elif yCount != _yCount:
            print("Files have different y counts, please check.")
            exit()


        ls = sorted(ls, key=lambda x: (float(x[0]), -float(x[1])))

        for i in range(2, len(headers)):
            varList = list()
            varName = headers[i]
            for item in ls:
                varList.append(item[i])
            fileOutputPath = outputPath + "/" + fileName.split(sep = ".")[0].replace("-", "/")
            os.makedirs(fileOutputPath, exist_ok = True)
            plt.figure(figsize=(xCount / yCount, yCount / xCount), dpi=5000)
            plt.contourf(np.reshape(varList, (xCount, yCount)))
            plt.axis("off")
            plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
            plt.savefig(fileOutputPath + "/" + varName + ".png")
            plt.close()