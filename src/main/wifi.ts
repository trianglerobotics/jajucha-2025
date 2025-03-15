// const ffi = require('ffi-napi');
// const ref = require('ref-napi');
// const StructType = require('ref-struct-di')(ref);
// const ArrayType = require('ref-array-di')(ref);

import ffi from 'ffi-napi';
import ref from 'ref-napi';
import StructType from 'ref-struct-di';
import ArrayType from 'ref-array-di';

const DWORD = ref.types.uint32;
const HANDLE = ref.refType(ref.types.void);
const WCHAR = ref.types.ushort;
const WLAN_MAX_NAME_LENGTH = 256;
const WLAN_CONNECTION_OPCODE = 7;

// const DOT11_MAC_ADDRESS = ArrayType(ref.types.uchar, 6);
// const DOT11_SSID = StructType({
//   uSSIDLength: DWORD,
//   ucSSID: ArrayType(ref.types.uchar, 32)
// }, { packed: true });

// const GUID = StructType({
//   Data1: DWORD,
//   Data2: ref.types.ushort,
//   Data3: ref.types.ushort,
//   Data4: ArrayType(ref.types.uchar, 8)
// }, { packed: true });

// const WLAN_INTERFACE_INFO = StructType({
//   InterfaceGuid: GUID,
//   strInterfaceDescription: ArrayType(WCHAR, WLAN_MAX_NAME_LENGTH),
//   isState: DWORD
// }, { packed: true });

// const WLAN_INTERFACE_INFO_LIST = StructType({
//   dwNumberOfItems: DWORD,
//   dwIndex: DWORD,
//   InterfaceInfo: ArrayType(WLAN_INTERFACE_INFO, 1)
// }, { packed: true });

// const WLAN_ASSOCIATION_ATTRIBUTES = StructType({
//   dot11Ssid: DOT11_SSID,
//   dot11BssType: DWORD,
//   dot11Bssid: DOT11_MAC_ADDRESS,
//   _padding: ArrayType(ref.types.uchar, 2),
//   dot11PhyType: DWORD,
//   uDot11PhyIndex: DWORD,
//   wlanSignalQuality: DWORD,
//   ulRxRate: DWORD,
//   ulTxRate: DWORD
// }, { packed: true });

// const WLAN_CONNECTION_ATTRIBUTES = StructType({
//   isState: DWORD,
//   wlanConnectionMode: DWORD,
//   strProfileName: ArrayType(WCHAR, WLAN_MAX_NAME_LENGTH),
//   wlanAssociationAttributes: WLAN_ASSOCIATION_ATTRIBUTES
// }, { packed: true });

// const wlanapi = ffi.Library('wlanapi', {
//   'WlanOpenHandle': ['uint32', ['uint32', 'pointer', 'pointer', HANDLE]],
//   'WlanEnumInterfaces': ['uint32', [HANDLE, 'pointer', ref.refType(WLAN_INTERFACE_INFO_LIST)]],
//   'WlanQueryInterface': ['uint32', [HANDLE, 'pointer', 'uint32', 'pointer', 'pointer', 'pointer', 'pointer']],
//   'WlanCloseHandle': ['uint32', [HANDLE, 'pointer']]
// });

// function openWlanHandle() {
//   const clientVersion = 2;
//   const negotiatedVersion = ref.alloc(DWORD);
//   const handleRef = ref.alloc(HANDLE);

//   if (wlanapi.WlanOpenHandle(clientVersion, ref.NULL, negotiatedVersion, handleRef) !== 0) {
//     throw new Error('WlanOpenHandle failed');
//   }
//   return handleRef.deref();
// }

// function closeWlanHandle(wlanHandle) {
//   wlanapi.WlanCloseHandle(wlanHandle, ref.NULL);
// }

// function getWifiInterfacesList(wlanHandle) {
//   const interfaceListRef = ref.alloc(ref.refType(WLAN_INTERFACE_INFO_LIST));
//   if (wlanapi.WlanEnumInterfaces(wlanHandle, ref.NULL, interfaceListRef) !== 0) {
//     throw new Error('WlanEnumInterfaces failed');
//   }

//   const interfaceList = interfaceListRef.deref().deref();
//   return Array.from({ length: interfaceList.dwNumberOfItems }, (_, i) => {
//     const iface = interfaceList.InterfaceInfo[i];
//     return {
//       index: i,
//       name: Buffer.from(iface.strInterfaceDescription.buffer).toString('utf16le').replace(/\0/g, ''),
//       state: iface.isState === 1 ? 'Connected' : 'Not Connected',
//       guid: iface.InterfaceGuid
//     };
//   });
// }

// function parseSSID(dot11Ssid) {
//   return Buffer.from(dot11Ssid.ucSSID.buffer.slice(0, dot11Ssid.uSSIDLength)).toString('utf8').replace(/\0/g, '');
// }

// function getInterfaceConnectedWifiInfo(wlanHandle, ifaceGuid) {
//   const ifaceGuidPtr = ifaceGuid.ref();
//   const dataSizeRef = ref.alloc(DWORD);
//   const dataRef = ref.alloc(ref.refType(ref.types.void));
//   const wlanOpcodeValueType = ref.alloc(DWORD);

//   if (wlanapi.WlanQueryInterface(wlanHandle, ifaceGuidPtr, WLAN_CONNECTION_OPCODE, ref.NULL, dataSizeRef, dataRef, wlanOpcodeValueType) !== 0) {
//     return null;
//   }

//   const rawDataBuffer = ref.reinterpret(dataRef.deref(), WLAN_CONNECTION_ATTRIBUTES.size, 0);
//   const connectionAttributes = WLAN_CONNECTION_ATTRIBUTES.get(rawDataBuffer, 0);

//   return {
//     ssid: parseSSID(connectionAttributes.wlanAssociationAttributes.dot11Ssid),
//     signalQuality: connectionAttributes.wlanAssociationAttributes.wlanSignalQuality,
//     rxRate: connectionAttributes.wlanAssociationAttributes.ulRxRate / 1000,
//     txRate: connectionAttributes.wlanAssociationAttributes.ulTxRate / 1000
//   };
// }

export function getAllConnectedWifiInfo() {
  // const wlanHandle = openWlanHandle();
  // const interfaces = getWifiInterfacesList(wlanHandle);
  // const connectedInterfaces = interfaces
  //   .filter(iface => iface.state === "Connected")
  //   .map(iface => {
  //     const wifiInfo = getInterfaceConnectedWifiInfo(wlanHandle, iface.guid);
  //     return { ...iface, ...wifiInfo };
  //   });

  // closeWlanHandle(wlanHandle);
  // return connectedInterfaces;
}


// module.exports = { getAllConnectedWifiInfo };
