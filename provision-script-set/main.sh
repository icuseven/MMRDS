
sudo apt-get update -y

# checking for virtual box guest addidions
# modinfo vboxguest


echo "checking if git is installed..."
if [[ -f "/usr/bin/git" ]]; then
	echo "git already installed,skipping..."
else
	echo "installing git..."
	#https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04
	sudo apt-get install git -y
fi


echo "checking if xfce4desktop is installed..."
if [[ -f "/usr/bin/xfdesktop" ]]; then
	echo "xfdesktop already installed,skipping..."
else
	echo "installing xfdesktop..."
	#sudo dpkg --configure -a	
	sudo sudo apt-get install xubuntu-desktop -y
fi



echo "checking if mono is installed..."
if [[ -f "/usr/bin/mono" ]]; then
	echo "mono already installed,skipping..."
else
	echo "installing mono..."

	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
	echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
	echo "deb http://download.mono-project.com/repo/debian wheezy-apache24-compat main" | sudo tee -a /etc/apt/sources.list.d/mono-xamarin.list
	sudo apt-get update -qqy

	sudo apt-get install mono-complete -y
	
fi


echo "checking if chrome is installed..."
if [[ -f "/opt/google/chrome/chrome" ]]; then
	echo "chrome already installed,skipping..."
else
	echo "installing chrome..."
	#http://askubuntu.com/questions/79280/how-to-install-chrome-browser-properly-via-command-line
	
	sudo apt-get install libxss1 libappindicator1 libindicator7
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
	sudo dpkg -i google-chrome*.deb
	sudo apt-get install -fy
	sudo dpkg -i google-chrome*.deb
fi

echo "checking if jdk is installed..."
if [[ -f "/usr/bin/java" ]]; then
	echo "jdk already installed,skipping..."
else
	echo "installing jdk..."
	sudo apt-get install openjdk-7-jdk -y
	
fi


echo "checking if nodejs is installed..."
if [[ -f "/usr/bin/nodejs" ]]; then
	echo "nodejs already installed,skipping..."
else
	echo "installing nodejs..."
	
	sudo apt-get install nodejs -y
	sudo apt-get install npm -y
	sudo npm install -g bower -y
	sudo ln -s /usr/bin/nodejs /usr/bin/node

fi

echo "checking if monodevelop is installed..."
if [[ -f "/usr/bin/monodevelop" ]]; then
	echo "monodevelop already installed,skipping..."
else
	echo "installing monodevelop..."
	sudo apt-get install monodevelop monodevelop-nunit monodevelop-versioncontrol monodevelop-database -y
fi


echo "checking if visual studio code is installed..."
if [[ -f "/home/vagrant/.local/share/umake/web/visual-studio-code/bin/code" ]]; then
	echo "visual studio code already installed,skipping..."
else
	echo "installing visual studio code..."
	# http://www.omgubuntu.co.uk/2015/05/how-to-install-microsoft-visual-studio-code-in-ubuntu
	sudo add-apt-repository ppa:ubuntu-desktop/ubuntu-make -y
	sudo apt-get update -y && sudo apt-get install ubuntu-make -y

	umake web visual-studio-code --accept-license /home/vagrant/.local/share/umake/web/visual-studio-code
fi


echo "checking if atom is installed..."
if [[ -f "/usr/bin/atom" ]]; then
	echo "atom already installed,skipping..."
else
	echo "installing atom..."
	sudo add-apt-repository ppa:webupd8team/atom -y
	sudo apt-get update -y
	sudo apt-get install atom -y
	
fi

echo "checking if Gufw is installed..."
if [[ -f "/usr/bin/gufw" ]]; then
	echo "Gufw already installed,skipping..."
else
	echo "installing Gufw..."
	sudo apt-get install gufw -y
	
fi


#https://github.com/foretagsplatsen/Divan
#https://github.com/rnewson/couchdb-lucene/tree/v0.4



if [[ -f "/usr/bin/couchdb" ]]; then
	echo "couchdb already installed,skipping..."
else
	echo "installing couchdb..."
	#https://pouchdb.com/guides/setup-couchdb.html
	sudo apt-get install couchdb -y
fi





echo "checking if webstorm is installed..."
if [[ -f "/home/vagrant/webstorm/bin/WebStorm.sh" ]]; then
	echo "webstorm already installed,skipping..."
else
	echo "installing webstorm..."
	
	#https://www.jetbrains.com/webstorm/download/download-thanks.html?platform=linux
	wget https://download.jetbrains.com/webstorm/WebStorm-2016.1.2.tar.gz
	sudo tar xfz WebStorm-*.tar.gz
	sudo mkdir /home/vagrant/webstorm
	sudo mv WebStorm-145.971.23/* /home/vagrant/webstorm
fi


echo ""
echo ""
echo "*****************************"
echo "... provisioning finished ..."
echo "*****************************"
