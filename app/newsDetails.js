import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AntDesign, Feather } from '@expo/vector-icons';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';
import * as FileSystem from 'expo-file-system'
import * as Sharing from "expo-sharing"
import ParsedText from 'react-native-parsed-text';
import * as Linking from 'expo-linking';


export default function NewsDetails() {
  const { title, image, likes=[], content, postId, author } = useLocalSearchParams();
  const [liked, setLiked] = useState(Array.isArray(likes) && likes.includes(user?._id));
  const router = useRouter();
  const { likePost, dislikePost, deletePost, updatePost } = useContext(PostContext)
  const { user } = useContext(AuthContext)

  const [showModal, setShowModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  const handleLike = async () => {
    setLiked(true); // Update the liked state
    await likePost(postId); // Pass postId to likePost
  };

  const handleDislike = async () => {
    setLiked(false); // Update the disliked state
    await dislikePost(postId); // Pass postId to dislikePost
  };

  const handleShare = async () => {
    try {
      const shareMessage = `${title}\n\n${content}\n\nRead more: https://yourwebsite.com/newsDetails?title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}&likes=${likes || 0}&content=${encodeURIComponent(content)}&postId=${postId}`;
  
      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing is not available on this device");
        return;
      }
  
      // Download the image to a local file
      const fileUri = `${FileSystem.cacheDirectory}shared-image.jpg`;
      const { uri } = await FileSystem.downloadAsync(image, fileUri);
  
      // Share the downloaded image
      await Sharing.shareAsync(uri, { dialogTitle: "Share News", mimeType: "image/jpeg" });
  
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleDelete = async () => {
    await deletePost(postId);
    router.back();
  };

  const handleEdit = () => {
    setShowModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      await updatePost(postId, { title: editedTitle, content: editedContent });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={hp(3.5)} color="black" />
        </TouchableOpacity>
        <View style={styles.actionBtn} >
          {user && (user?.role === "admin" || user?._id === state?.author) && (
            <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash-2" size={hp(2.5)} color="red" />
            </TouchableOpacity>
          )}
          {user && (user?.role === "admin" || user?._id === state?.author) && (
            <TouchableOpacity onPress={handleEdit}>
              <Feather name="edit" size={hp(2.5)}/>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleShare}>
            <Feather name="share-2" size={hp(2.5)} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Image not available</Text>
        )}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.reads}>{likes} likes</Text>

        {/* Like Button */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => {
            setLiked(!liked);
            liked ? handleDislike() : handleLike(); // Toggle like/dislike
          }}
        >
          <AntDesign name={liked ? "heart" : "hearto"} size={hp(3)} color={liked ? "red" : "black"} />
        </TouchableOpacity>

        <ParsedText
          style={styles.content}
          parse={[
            { 
               type: 'url', 
               style: styles.link, 
               onPress: (url) => Linking.openURL(url), 
               renderText: (matchingString) => {
                try {
                  const urlObj = new URL(matchingString)
                  return `${urlObj.hostname}/...`
                } catch (error) {
                  return matchingString;
                }
               }
            },
          ]}
          selectable={true}
        >
          {content}
        </ParsedText>

      </ScrollView>
      {/* Edit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Edit Title"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedContent}
              onChangeText={setEditedContent}
              placeholder="Edit Content"
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between"
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginLeft: wp(3),
  },
  container: {
    padding: wp(5),
  },
  image: {
    width: "100%",
    height: hp(30),
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  imagePlaceholder: {
    textAlign: "center",
    fontSize: hp(2),
    color: "gray",
    marginBottom: hp(2),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginBottom: hp(1),
  },
  reads: {
    color: "#888",
    fontSize: hp(1.8),
    marginBottom: hp(1.5),
  },
  likeButton: {
    alignSelf: "flex-start",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    backgroundColor: "#f5f5f5",
    marginBottom: hp(2),
  },
  content: {
    fontSize: hp(2),
    lineHeight: hp(3),
    fontWeight: "300",
  },
  actionBtn: {
    flexDirection: "row",
    gap: hp(2)
  },
  link: {
    color: "#007AFF",  // A cool blue color
    fontWeight: "bold",
    textDecorationLine: "underline",
    backgroundColor: "#E5F1FF", // Light blue background for visibility
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    textArea: {
      height: 100,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    cancelButton: {
      color: 'red',
      fontWeight: 'bold',
    },
    saveButton: {
      color: 'blue',
      fontWeight: 'bold',
    },
});
