import cv2
import datetime
import sys
import os
from imutils.object_detection import non_max_suppression
import numpy as np
import cv2


def delta(num1, num2):
    return num2-num1


def stich(list):
    newlist = []
    for i in range(len(list)):
        if (delta(list[i][0], list[i][1]) < 1000):
            if (i+1 < len(list)):
                newlist.append([list[i][0], list[i+1][1]])
        else:
            newlist.append(list[i])
    return newlist


def textDetect(imageLocation, confidence, width, height):
    # maipulationg the image to our convenience
    image = cv2.imread(imageLocation)
    orig = image.copy()
    H, W = image.shape[:2]
    rW = W/float(width)
    rH = H/float(height)
    image = cv2.resize(image, (width, height))
    H, W = image.shape[:2]

    # starting east text detection
    layerNames = [
        "feature_fusion/Conv_7/Sigmoid",
        "feature_fusion/concat_3"]
    pathDset = "/Users/dhiraj/Desktop/ai_scriber/AiScriber/serverPy/objectDetection/frozen_east_text_detection.pb"
    net = cv2.dnn.readNet(pathDset)
    blob = cv2.dnn.blobFromImage(image, 1.0, (W, H),
                                 (123.68, 116.78, 103.94), swapRB=True, crop=False)
    net.setInput(blob)
    (scores, geometry) = net.forward(layerNames)
    (numRows, numCols) = scores.shape[2:4]
    rects = []
    confidences = []
    textCount = 0
    for y in range(0, numRows):
        # extract the scores (probabilities), followed by the geometrical
        # data used to derive potential bounding box coordinates that
        # surround text
        scoresData = scores[0, 0, y]
        xData0 = geometry[0, 0, y]
        xData1 = geometry[0, 1, y]
        xData2 = geometry[0, 2, y]
        xData3 = geometry[0, 3, y]
        anglesData = geometry[0, 4, y]
    # loop over the number of columns
        for x in range(0, numCols):
            # if our score does not have sufficient probability, ignore it
            if scoresData[x] < confidence:
                continue
            # compute the offset factor as our resulting feature maps will
            # be 4x smaller than the input image
            (offsetX, offsetY) = (x * 4.0, y * 4.0)
            # extract the rotation angle for the prediction and then
            # compute the sin and cosine
            angle = anglesData[x]
            cos = np.cos(angle)
            sin = np.sin(angle)
            # use the geometry volume to derive the width and height of
            # the bounding box
            h = xData0[x] + xData2[x]
            w = xData1[x] + xData3[x]
            # compute both the starting and ending (x, y)-coordinates for
            # the text prediction bounding box
            endX = int(offsetX + (cos * xData1[x]) + (sin * xData2[x]))
            endY = int(offsetY - (sin * xData1[x]) + (cos * xData2[x]))
            startX = int(endX - w)
            startY = int(endY - h)
            # add the bounding box coordinates and probability score to
            # our respective lists
            rects.append((startX, startY, endX, endY))
            confidences.append(scoresData[x])

    # apply non-maxima suppression to suppress weak, overlapping bounding
    # boxes
    boxes = non_max_suppression(np.array(rects), probs=confidences)
    # loop over the bounding boxes
    for (startX, startY, endX, endY) in boxes:
        # scale the bounding box coordinates based on the respective
        # ratios
        startX = int(startX * rW)
        startY = int(startY * rH)
        endX = int(endX * rW)
        endY = int(endY * rH)
        # draw the bounding box on the image
        cv2.rectangle(orig, (startX, startY), (endX, endY), (0, 255, 0), 2)
        textCount = textCount+1
    # show the output image
    return textCount
    # cv2.imshow("Text Detection", orig)
    # cv2.waitKey(0)

# path = "C:/Users/nitin/DevHackFinal/AiScriber/server-node/test/Image/"
# textDetect(path+"testImage3.jpg", 0.5, 320, 320)


def objDet():
    cap = cv2.VideoCapture(
        "/Users/dhiraj/Desktop/ai_scriber/AiScriber/server_node/client/uploads/Lecture.mp4")
    scale_percent = 60
    classNames = []
    classFile = "/Users/dhiraj/Desktop/ai_scriber/AiScriber/serverPy/objectDetection/coco.names"
    with open(classFile, 'rt') as f:
        classNames = f.read().rstrip('\n').split('\n')
    # configPath = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
    # weightPath = 'frozen_inference_graph.pb'

    net = cv2.dnn_DetectionModel(
        "/Users/dhiraj/Desktop/ai_scriber/AiScriber/serverPy/objectDetection/frozen_inference_graph.pb", "/Users/dhiraj/Desktop/ai_scriber/AiScriber/serverPy/objectDetection/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt")
    net.setInputSize(320, 320)
    net.setInputScale(1.0/127.5)
    net.setInputMean((127.5, 127.5, 127.5))
    net.setInputSwapRB(True)
    timeStamps: list(list()) = []
    prevClassId = 0
    success = 1
    # frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    # fps = cap.get(cv2.CAP_PROP_FPS)
    # # calculate duration of the video
    # seconds = round(frames / fps)
    # video_time = datetime.timedelta(seconds=seconds)

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
                        img = cv2.resize(
                            img, dim, interpolation=cv2.INTER_AREA)
                        classIds, confs, bbox = net.detect(
                            img, confThreshold=0.55)
                    stampArr.append(float(cap.get(cv2.CAP_PROP_POS_MSEC)))
                prevClassId = 0
                timeStamps.append(stampArr)
        except (AttributeError):
            stampArr.append(cap.get(cv2.CAP_PROP_POS_MSEC))
            timeStamps.append(stampArr)
            pass
    if (len(timeStamps[len(timeStamps)-1]) != 2):
        timeStamps[len(timeStamps)-1].append(float(10e7))

    newList = stich(timeStamps)
    while (newList != timeStamps):
        timeStamps = newList
        newList = stich(timeStamps)
    for x in timeStamps:
        print(x)

    cap.release()
    cv2.destroyAllWindows()
    cap = cv2.VideoCapture(
        "/Users/dhiraj/Desktop/ai_scriber/AiScriber/server_node/client/uploads/Lecture.mp4")
    success = 1
    stampIndex = 0
    timeStampsRetArr = []
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
                    pathStr = "/Users/dhiraj/Desktop/ai_scriber/AiScriber/server_node/client/extracted/" + \
                        str(stampIndex)+".jpg"
                    cv2.imwrite(pathStr, img)
                    if (textDetect(pathStr, 0.5, 320, 320) > 1):
                        timeStampsRetArr.append(stampIndex)
            cv2.destroyAllWindows()
        except (AttributeError):
            pass
    cap.release()
    cv2.destroyAllWindows()

    return [timeStamps, timeStampsRetArr]
