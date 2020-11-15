# prelude-pos-v2

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn electron:serve
```

### Compiles and minifies for production

```
yarn electron:build
```

### Linux libraries for eId-card reading
```
sudo apt install libpcsclite1 libpcsclite-dev pcscd
```
Also, the card reading software from the Belgium government must be installed so the system can use the shared libraries
```
sudo apt install eid-mw eid-viewer
```
More info on https://eid.belgium.be/en/linux-eid-software-installation

### Linux udev rules for NFC HID tag reader

/etc/udev/rules.d/XX-disable-usb-hid.rules

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="072f", ATTRS{idProduct}=="2217", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{idVendor}=="072f", ATTRS{idProduct}=="2217", MODE="0666", GROUP="plugdev"
```
