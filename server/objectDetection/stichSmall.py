def delta(num1, num2):
    return num1-num2


def stich(list):
    newlist = []
    for i in range(len(list)):
        if (delta(list[i][0], list[i][1]) < 200):
            if (i+1 < len(list)):
                newlist.append([list[i][0], list[i+1][1]])
        else:
            newlist.append(list[i])
    return newlist
