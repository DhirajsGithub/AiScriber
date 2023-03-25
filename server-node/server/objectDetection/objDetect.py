import cv2
import datetime
import sys
import stichSmall as ss
import textLocalization
sys.path.insert(0, 'C:/Users/nitin/DevHackFinal/AiScriber/server-node/server/textDetection')
cap = cv2.VideoCapture("../../client/uploads/Lecture.mp4")
scale_percent = 60
classNames = []
classFile = 'coco.names'
with open(classFile, 'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')
configPath = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
weightPath = 'frozen_inference_graph.pb'

net = cv2.dnn_DetectionModel(weightPath, configPath)
net.setInputSize(320, 320)
net.setInputScale(1.0/127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)
timeStamps: list(list()) = []
prevClassId = 0
success = 1
frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
fps = cap.get(cv2.CAP_PROP_FPS)
# calculate duration of the video
seconds = round(frames / fps)
video_time = datetime.timedelta(seconds=seconds)

while success:
    success, img = cap.read()
    stampArr = []
    try:
        width = int(img.shape[1] * scale_percent / 100)
        height = int(img.shape[0] * scale_percent / 100)
        dim = (width, height)
        img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
        classIds, confs, bbox = net.detect(img, confThreshold=0.55)
        if (len(classIds) != 0 and (1 in classIds)):
            stampArr.append(float(cap.get(cv2.CAP_PROP_POS_MSEC)))
            prevClassId = 1
            if (prevClassId == 1):
                while (success and (1 in classIds)):
                    success, img = cap.read()
                    width = int(img.shape[1] * scale_percent / 100)
                    height = int(img.shape[0] * scale_percent / 100)
                    dim = (width, height)
                    img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
                    classIds, confs, bbox = net.detect(img, confThreshold=0.55)
                stampArr.append(float(cap.get(cv2.CAP_PROP_POS_MSEC)))
            prevClassId = 0
            timeStamps.append(stampArr)
    except (AttributeError):
        stampArr.append(cap.get(cv2.CAP_PROP_POS_MSEC))
        timeStamps.append(stampArr)
        pass
if (len(timeStamps[len(timeStamps)-1]) != 2):
    timeStamps[len(timeStamps)-1].append(float(10e7))

newList = ss.stich(timeStamps)
while (newList != timeStamps):
    timeStamps = newList
    newList = ss.stich(timeStamps)
for x in timeStamps:
    print(x)

cap.release()
cv2.destroyAllWindows()
cap = cv2.VideoCapture("../../client/uploads/Lecture.mp4")
success = 1
stampIndex = 0
while (success):
    success, img = cap.read()
    try:
        width = int(img.shape[1] * scale_percent / 100)
        height = int(img.shape[0] * scale_percent / 100)
        dim = (width, height)
        img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
        if (stampIndex >= len(timeStamps)):
            break
        currentStart = timeStamps[stampIndex][0]
        currentEnd = timeStamps[stampIndex][1]
        if (float(cap.get(cv2.CAP_PROP_POS_MSEC)) == currentStart):
            print(f'Start {currentStart}')
        if (float(cap.get(cv2.CAP_PROP_POS_MSEC)) > currentEnd):
            stampIndex = stampIndex+1
        while (success and currentStart < float(cap.get(cv2.CAP_PROP_POS_MSEC)) and float(cap.get(cv2.CAP_PROP_POS_MSEC)) < currentEnd):
            success, img = cap.read()
            if (float(cap.get(cv2.CAP_PROP_POS_MSEC)) == currentEnd):
                classIds, confs, bbox = net.detect(img, confThreshold=0.55)
                pathStr = "../../client/extracted/image" + \
                    str(stampIndex)+".jpg"
                cv2.imwrite(pathStr, img)
                if (textLocalization.textDetect(pathStr,0.5,320,320)>1):
                    print(stampIndex)
        cv2.destroyAllWindows()
    except (AttributeError):
        pass
cap.release()
cv2.destroyAllWindows()
