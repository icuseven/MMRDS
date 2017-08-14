#!/bin/bash

# move files from console to input directory
# move files from server to input directory
# move standard mmria.exe.config to input directory
# move standard mmria-server.exe.config to input directory
# run SED on input directory
# 
# run install.setup
# run wix candle on input directory
# run wix light on input directory


#wix_input_directory = "/workspace/wix/input"
#wix_output_directory = "/workspace/wix/output"
#source_code_directory = "/workspace/MMRDS/source-code/scratch/owin"

wix_root_directory="/vagrant/source-code/wix"
wix_input_directory="/vagrant/source-code/wix/input"
wix_output_directory="/vagrant/source-code/wix/output"
source_code_directory="/vagrant/source-code/MMRDS"
current_directory="/vagrant/source-code/mmria-install"



cd $source_code_directory 


#"$source_code_directory/install.setup/bin/Debug/install.setup.exe" "wix_directory_path:$wix_root_directory" "input_directory_path:$wix_input_directory" "output_directory_path:$wix_output_directory"


#exit 1


sudo docker run -it --rm  -v "$source_code_directory/install.setup":/workspace mono:4.6.2  bash -c "xbuild /workspace/install.setup.csproj" && \
sudo docker run -it --rm  -v "$source_code_directory":/workspace mono:4.6.2  bash -c "xbuild /workspace/mmrds-importer/mmria-console.csproj" && \
sudo docker run -it --rm  -v "$source_code_directory":/workspace mono:4.6.2  bash -c "xbuild /workspace/owin/mmria-server.csproj" 

sudo rm -rf $wix_input_directory && \
sudo rm -rf $wix_output_directory && \
sudo mkdir $wix_input_directory && \
sudo mkdir "${wix_input_directory}//app" && \
sudo mkdir $wix_output_directory

# move files from console to input directory
# move files from server to input directory

cp -rf "${source_code_directory}/mmrds-importer/bin/Debug/." $wix_input_directory && \
cp -rf "${source_code_directory}/owin/bin/Debug/." $wix_input_directory && \
cp -rf "${source_code_directory}/owin/psk/app" $wix_input_directory

rm -f "${wix_input_directory}/app/grid-test-1.html" && \
rm -f "$wix_input_directory/app/grid-test-2.html" && \
rm -f "$wix_input_directory/app/grid-test-3.html" && \
rm -f "$wix_input_directory/app/socket-test.html" && \
rm -f "$wix_input_directory/app/socket-test2.html" && \
rm -f "$wix_input_directory/app/manifest.json" && \
rm -rf "$wix_input_directory/app/meta-data" && \
rm -rf "$wix_input_directory/mmria-server.exe.config" && \
rm -rf "$wix_input_directory/mmria.exe.config" && \
cp -rf "$current_directory/mmria-server.exe.config" $wix_input_directory && \
cp -rf "$current_directory/mmria.exe.config" $wix_input_directory

# move standard mmria.exe.config to input directory
# move standard mmria-server.exe.config to input directory
# run SED on input directory
current_build=$(git rev-parse --short HEAD)
current_year=$(date +%y)
current_month=$(date +%m)
current_day=$(date +%d)

cp "${source_code_directory}/owin/psk/app/scripts/profile.js" "$wix_root_directory/profile.js.bk" && \
cp "${source_code_directory}/owin/psk/app/index.html" "$wix_root_directory/index.html.bk" && \
sed -e 's/<\%=version\%>/'$current_year'.'$current_month'.'$current_day' v('$current_build')/g' "${wix_root_directory}/profile.js.bk"  > "${wix_root_directory}/profile.js" && \
sed -e 's/<\%=version\%>/'$current_year'.'$current_month'.'$current_day' v('$current_build')/g' "${wix_root_directory}/index.html.bk"  > "${wix_root_directory}/index.html" && \
rm -f "$wix_input_directory/app/scripts/profile.js" && cp "$wix_root_directory/profile.js" "$wix_input_directory/app/scripts/profile.js" && \
rm -f "$wix_input_directory/app/index.html" && cp "$wix_root_directory/index.html" "$wix_input_directory/app/index.html"




# run install.setup

sudo "$source_code_directory/install.setup/bin/Debug/install.setup.exe" "wix_directory_path:$wix_root_directory" "input_directory_path:$wix_input_directory" "output_directory_path:$wix_output_directory"
sed -e 's/MMRIA 1.0.0/MMRIA '$current_year'.'$current_month'.'$current_day' v('$current_build')/ig' "${wix_output_directory}/output.xml"  > "${wix_output_directory}/output.tmp" && \
rm -rf "${wix_output_directory}/output.xml" && mv "${wix_output_directory}/output.tmp" "${wix_output_directory}/output.xml" 



# run wix candle on input directory
#sudo docker run -it --rm  -v "$source_code_directory":/workspace  suchja/wix:latest bash -c "/home/xclient/wix/candle.exe -ext /home/xclient/wix/WixNetFxExtension.dll ${wix_output_directory}/output.xml"


# run wix light on input directory
#sudo docker run -it --rm  -v "$source_code_directory":/workspace  suchja/wix:latest bash -c "/home/xclient/wix/light.exe  -ext /home/xclient/wix/WixNetFxExtension.dll ${wix_output_directory}/output.wixobj"



# cd /workspace/test && \
# rm -rf dll_set && cp -rf ../MMRDS/source-code/scratch/owin/dll_set dll_set && \
# rm -rf mmria.common && cp -rf ../MMRDS/source-code/scratch/owin/mmria.common mmria.common && \
# rm -rf owin && cp -rf ../MMRDS/source-code/scratch/owin/owin owin && \
# rm owin/app.config && cp app.config  owin/app.config && \
# cp /workspace/MMRDS/source-code/scratch/owin/owin/psk/app/scripts/profile.js /workspace/profile.js.bk && \
# cp /workspace/MMRDS/source-code/scratch/owin/owin/psk/app/index.html /workspace/index.html.bk && \
# sed -e 's/<\%=version\%>/'$current_year'.'$current_month'.'$current_day' v('$current_build')/g' /workspace/profile.js.bk  > /workspace/profile.js && \
# sed -e 's/<\%=version\%>/'$current_year'.'$current_month'.'$current_day' v('$current_build')/g' /workspace/index.html.bk  > /workspace/index.html && \
# rm -f owin/psk/app/scripts/profile.js && cp /workspace/profile.js owin/psk/app/scripts/profile.js && \
# rm -f owin/psk/app/index.html && cp /workspace/index.html owin/psk/app/index.html && \
# docker build -t mmria_test .  && \
# docker stop mmria-test && docker rm mmria-test && \
# docker run --name mmria-test -d  --publish 8080:9000 \
# -e geocode_api_key="none" \
# -e geocode_api_url="none" \
# -e couchdb_url="http://db1.mmria.org:5982" \
# -e web_site_url="http://*:9000" \
# -e file_root_folder="/workspace/owin/psk/app" \
# -e timer_user_name="mmrds" \
# -e timer_password="mmrds" \
# -e cron_schedule="0 */1 * * * ?" \
# mmria_test

