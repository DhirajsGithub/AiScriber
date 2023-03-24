import cv2
import datetime
# img = cv2.imread("../../test/Image/testImage2.jpg")
cap = cv2.VideoCapture("../../test/Video/testVideo1.mp4")
scale_percent = 60  # percent of original size
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
        classIds, confs, bbox = net.detect(img, confThreshold=0.5)
        if (len(classIds) != 0 and (1 in classIds)):
            stampArr.append(str(cap.get(cv2.CAP_PROP_POS_MSEC)))
            prevClassId = 1
            if (prevClassId == 1):
                while (success and (1 in classIds)):
                    success, img = cap.read()
                    width = int(img.shape[1] * scale_percent / 100)
                    height = int(img.shape[0] * scale_percent / 100)
                    dim = (width, height)
                    img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
                    classIds, confs, bbox = net.detect(img, confThreshold=0.5)
                stampArr.append(str(cap.get(cv2.CAP_PROP_POS_MSEC)))
            prevClassId = 0
            timeStamps.append(stampArr)
    except (AttributeError):
        timeStamps.append(stampArr)
        pass
print(timeStamps)
print(timeStamps[0][0])
print(timeStamps[0][1])
cap.release()
cv2.destroyAllWindows()
cap = cv2.VideoCapture("../../test/Video/testVideo1.mp4")
success = 1
stampIndex = 0
while (success):
    success, img = cap.read()
    try:
        width = int(img.shape[1] * scale_percent / 100)
        height = int(img.shape[0] * scale_percent / 100)
        dim = (width, height)
        img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
        if (timeStamps[stampIndex][0] == str(cap.get(cv2.CAP_PROP_POS_MSEC))):
            print(f'Current Timestamp in: {timeStamps[stampIndex][0]}')
            print(timeStamps[stampIndex][1])
            while (float(str(cap.get(cv2.CAP_PROP_POS_MSEC))) < float(timeStamps[stampIndex][1]) and success):
                success, img = cap.read()
                width = int(img.shape[1] * scale_percent / 100)
                height = int(img.shape[0] * scale_percent / 100)
                dim = (width, height)
                img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
                cv2.imshow('Object', img)
            stampIndex = stampIndex+1
    except (AttributeError):
        pass
cap.release()
cv2.destroyAllWindows()
