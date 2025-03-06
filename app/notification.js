import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { NotificationContext } from '../context/NotificationContext';
import { Checkbox } from 'react-native-paper';




export default function Notification() {
  const router = useRouter();
  const { notifications, fetchNotifications, markNotificationAsRead, deleteNotifications } = useContext(NotificationContext);

  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)

  useEffect(() => {
    fetchNotifications()
  },[])

  const handleNotificationPress  = (notification) => {
    if (selectionMode) {
      toggleSelection(notification._id)
      return;
    }

    markNotificationAsRead(notification._id);

    if (notification.url) {
      router.push(notification.url)
    }
  }

  const handleLongPress = (notificationId) => {
    setSelectionMode(true)
    toggleSelection(notificationId);
  }

  const toggleSelection = (notificationId) => {
    setSelectedNotifications((prev) => 
        prev.includes(notificationId)
          ? prev.filter((id) => id !== notificationId)
          : [...prev, notificationId]
    )
  }

  const clearSelection = () => {
    setSelectedNotifications([])
    setSelectionMode(false)
  }

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach((id) => markNotificationAsRead(id));
    clearSelection();
  };

  const handleBulkDelete = async () => {
    await deleteNotifications(selectedNotifications);
    clearSelection();
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
          {selectionMode ? (
              <>
                <TouchableOpacity onPress={clearSelection}>
                  <Feather name="x" size={hp(3.5)} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedNotifications.length} Selected</Text>
                <TouchableOpacity onPress={handleBulkMarkAsRead}>
                  <Feather name="check-circle" size={hp(3)} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBulkDelete}>
                  <Feather name="trash-2" size={hp(3)} color="red" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => router.back()}>
                  <Feather name="chevron-left" size={hp(3.5)} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity>
                  {/* Add options menu here if needed */}
                </TouchableOpacity>
              </>
          )}
      </View>
      
      <ScrollView contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : null}>
        {notifications.length === 0 ? (
          <View style={styles.noNotificationsContainer}>
            <Feather name="bell-off" size={hp(10)} color="#ccc" />
            <Text style={styles.noNotifications}>No notifications available</Text>
          </View>
        ) : (
          [...notifications]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
            .map((item) => (
              <TouchableOpacity 
                key={item._id} 
                style={[styles.notificationCard, item.read && styles.readNotification]} 
                onPress={() => handleNotificationPress(item)}
                onLongPress={() => handleLongPress(item._id)}
              >
                {selectionMode ? (
                  <Checkbox
                    status={selectedNotifications.includes(item._id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleSelection(item._id)}
                  />
                ) : item.image ? (
                  <Image source={{ uri: item.image }} style={styles.notificationImage} />
                ) : (
                  <Feather name="bell" size={hp(4)} color="gray" style={styles.icon} />
                )}
                
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationTitle} 
                     numberOfLines={1}
                     ellipsizeMode='tail'

                  >
                       {item.title}
                    </Text>
                  <Text 
                     style={styles.notificationMessage}
                     numberOfLines={1}
                     ellipsizeMode='tail'
                     >
                        {item.message}
                     </Text>
                </View>

                {!item.read && !selectionMode && <View style={styles.unreadIndicator} />}
              </TouchableOpacity>
            ))
        )}
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
    gap: hp(3)
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: 'black',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: hp(2),
    marginVertical: hp(1),
    marginHorizontal: wp(4),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  notificationImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(1),
    marginRight: wp(4),
  },
  icon: {
    width: hp(6),
    height: hp(6),
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: hp(3),
    backgroundColor: '#f0f0f0',
    marginRight: wp(4),
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: 'black'
  },
  unreadIndicator: {
    width: hp(1.2),
    height: hp(1.2),
    borderRadius: hp(0.75),
    backgroundColor: 'red',
    position: 'absolute',
    right: hp(2),
  },  
  notificationMessage: {
    fontSize: hp(1.4),
    color: 'gray',
    marginTop: hp(0.5)
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(15),
    opacity: 0.7,  // Subtle fade effect for a cleaner look
  },
  noNotifications: {
    fontSize: hp(2.5),
    color: 'gray',
    fontWeight: '600',
    marginTop: hp(2),
  },
});
