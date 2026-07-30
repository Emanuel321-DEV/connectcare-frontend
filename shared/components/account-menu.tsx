import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccountMenuProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  accentColor: string;
  onLogout: () => void;
}

export function AccountMenu({ visible, onClose, userName, userEmail, accentColor, onLogout }: AccountMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        <View className="absolute top-14 right-5 w-64 bg-white rounded-2xl shadow-lg overflow-hidden" style={{ elevation: 6 }}>
          <View className="px-4 py-3 border-b border-[#EAEAF0]">
            <Text className="text-[#1A1C1E] font-semibold text-base">{userName}</Text>
            {userEmail ? <Text className="text-[#697083] text-xs mt-0.5">{userEmail}</Text> : null}
          </View>

          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={() => {
              onClose();
              onLogout();
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#D33131" />
            <Text className="text-[#D33131] font-medium text-sm ml-3">Sair</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
