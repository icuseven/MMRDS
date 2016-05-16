
sudo apt-get update #-qqy

# checking for virtual box guest addidions
# modinfo vboxguest


echo "checking if xfce4desktop is installed..."
if [[ -f "/usr/bin/xfdesktop" ]]; then
	echo "xfdesktop already installed,skipping..."
else
	echo "installing if xfdesktop..."
	sudo dpkg --configure -a	
	sudo sudo apt-get install xubuntu-desktop -y
fi
