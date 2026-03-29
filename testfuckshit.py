import re
difile = open("test.diff", 'r')
difftxt = re.sub('> ', '', difile.read())
fuckshit = difftxt.split('\n')
difftxt2electricboogaloo = ""
windex = 0
for f in fuckshit:
	if windex >= 2:
		difftxt2electricboogaloo += f"{f}\n"
	windex += 1
print("[ " + difftxt2electricboogaloo + "}]")