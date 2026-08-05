import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, UserCheck } from 'lucide-react-native';
import { UserProfile, GenderType } from '../../types';
import { useThemeStore } from '../../store/useThemeStore';
import { PREDEFINED_CITIES } from '../../config/constants';
import { validateEmail, validateMobileNumber } from '../../utils/validation';
import { CustomInput } from '../common/CustomInput';
import { RadioGroup } from '../common/RadioGroup';
import { DropdownPicker } from '../common/DropdownPicker';
import { CustomButton } from '../common/CustomButton';

interface EditProfileModalProps {
  visible: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (updatedData: Partial<UserProfile>) => Promise<boolean>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  user,
  onClose,
  onSave,
}) => {
  const { theme } = useThemeStore();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState<GenderType>(user.gender);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setGender(user.gender);
      setMobileNumber(user.mobileNumber);
      setAddress(user.address);
      setCity(user.city);
    }
  }, [user, visible]);

  const handleSave = async () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const mobileErr = validateMobileNumber(mobileNumber);
    if (mobileErr) newErrors.mobileNumber = mobileErr;
    if (!address.trim()) newErrors.address = 'Address is required.';
    if (!city.trim()) newErrors.city = 'City is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const success = await onSave({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      gender,
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      city: city.trim(),
    });

    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.titleRow}>
              <UserCheck size={22} color={theme.primary} />
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Edit Profile Information
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
            />

            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <RadioGroup
              label="Gender"
              options={['Male', 'Female', 'Other', 'Prefer not to say']}
              selectedOption={gender}
              onSelect={setGender}
            />

            <CustomInput
              label="Mobile Number (10 Digits)"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="numeric"
              maxLength={10}
              error={errors.mobileNumber}
            />

            <CustomInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={2}
              error={errors.address}
            />

            <DropdownPicker
              label="City"
              options={PREDEFINED_CITIES}
              selectedOption={city}
              onSelect={setCity}
              error={errors.city}
            />
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              title="Save Changes"
              onPress={handleSave}
              isLoading={isSaving}
              variant="primary"
              size="large"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  footer: {
    marginTop: 16,
  },
});
