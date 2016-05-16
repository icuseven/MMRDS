# -*- mode: ruby -*-
# vi: set ft=ruby :

Configuration_Version = 2

Vagrant.configure(Configuration_Version) do |config|
	# intall plugin to vbox guest additions updatedvagrant
	#vagrant plugin install vagrant-vbguest
	
	
	config.vm.define "devbox" do |devbox|
  
		devbox.vm.box = "ubuntu/trusty64"
	  
		devbox.vm.network "forwarded_port", guest: 80, host: 8085
		
		devbox.vm.network "private_network", ip: "192.168.33.10"
		
	  
		#devbox.vm.synced_folder '.', '/vagrant', type: 'nfs'
	  
	  
		devbox.vm.provider "virtualbox" do |vb|
			# Display the VirtualBox GUI when booting the machine
			vb.gui = true
	  
			# Customize the amount of memory on the VM:
			vb.memory = "2048"
			vb.cpus = 4
		end
	  
		#devbox.vbguest.iso_path = "%PROGRAMFILES%/Oracle/VirtualBox/VBoxGuestAdditions.iso"
		devbox.vbguest.iso_path = "D:/programfileset/Oracle/VirtualBox/VBoxGuestAdditions.iso"
		devbox.vbguest.auto_update = true

		devbox.vm.provision "shell", path:  "provision-script-set/main.sh"
	  end
	  

end
