dir=$(ls -l ./src |awk '/^d/ {print $NF}')
cur_date="`date +%Y%m%d`" 
for i in $dir
do
npx cross-env ENV_file=${i} webpack --config ./build/webpack.pro.js 
echo "打包的文件夹是: $i"
done
cd dist
tar -zcvf ../sparrow_${cur_date}.tar.gz ./*
echo "打包完毕""