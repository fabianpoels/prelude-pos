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

### Linux udev rules for NFC HID tag reader

/etc/udev/rules.d/XX-disable-usb-hid.rules

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="072f", ATTRS{idProduct}=="2217", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{idVendor}=="072f", ATTRS{idProduct}=="2217", MODE="0666", GROUP="plugdev"
```
