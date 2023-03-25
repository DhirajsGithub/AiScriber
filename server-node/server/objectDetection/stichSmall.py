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
