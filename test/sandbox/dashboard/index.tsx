import React from 'react';
import { View, Text } from 'react-native';

export default function SandboxEmpty() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090b' }}>
      <Text style={{ color: '#a1a1aa', fontFamily: 'monospace', fontSize: 13 }}>
        [ ENCLAVE_SANDBOX: AWAITING_PAYLOAD_ENTRY ]
      </Text>
    </View>
  );
}
