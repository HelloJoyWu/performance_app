SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin

declare -a typoWords=("總類" "測試")

for i in "${typoWords[@]}"
do
   echo "Check on $i"
   # or do whatever with individual element of the array
   grep -rnw --exclude-dir=node_modules --exclude-dir=ios --exclude-dir=android --exclude=chineseTypoChecker.sh . -e "$i"
done
