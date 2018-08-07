dir=$(ls -l ./src |awk '/^d/ {print $NF}')
cur_date="`date +%Y%m%d%H%M%S`" 
for i in $dir
do
npx cross-env ENV_file=${i} webpack --config ./build/webpack.pro.js 
echo "打包的文件夹是: $i"
done
mv dist/ sparrow_${cur_date}
tar -zcvf ./sparrow_${cur_date}.tar.gz ./sparrow_${cur_date}/*
rm -r sparrow_${cur_date}
mkdir dist
mv sparrow_${cur_date}.tar.gz dist
echo "打包完毕"