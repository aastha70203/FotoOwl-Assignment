import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { X, Download } from 'lucide-react-native';

interface FullScreenViewerProps {
  visible: boolean;
  imageUrl: string;
  author: string;
  imageId: string;
  onClose: () => void;
  onDownload: () => void;
}

const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({
  visible,
  imageUrl,
  author,
  imageId,
  onClose,
  onDownload,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(imageUrl || FALLBACK_IMAGE_URL);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Top Floating Control Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.authorText}>{author}</Text>
            <Text style={styles.idText}>Asset #{imageId}</Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Full Image */}
        <View style={styles.imageWrapper}>
          {loading && (
            <View style={styles.loaderCenter}>
              <ActivityIndicator size="large" color="#6C5CE7" />
            </View>
          )}
          <Image
            source={{ uri: currentUrl }}
            style={styles.fullImage}
            contentFit="contain"
            transition={300}
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setCurrentUrl(FALLBACK_IMAGE_URL);
            }}
          />
        </View>

        {/* Bottom Download Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={onDownload} style={styles.downloadBtn}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.downloadText}>Download Full High-Res</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  idText: {
    color: '#00CEC9',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loaderCenter: {
    position: 'absolute',
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
