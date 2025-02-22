import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';
import { CATEGORIES } from '../constant/categories';

export default function Post() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const { createPost } = useContext(PostContext)
  const { user } = useContext(AuthContext)

  const [category, setCategory] = useState(null);
  const [important, setImportant] = useState(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openImportant, setOpenImportant] = useState(false);

  const [countryList, setCountryList] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]); 
  const [country, setCountry] = useState(null);
  const [openCountry, setOpenCountry] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
            try {
              const response = await fetch('https://restcountries.com/v3.1/all');
              const data = await response.json();
              const formattedCountries = data.map((c) => c.name.common);
              setCountryList(formattedCountries);
            } catch (error) {
              console.error('Error fetching countries:', error);
            }
          };
          fetchCountries();
  },[])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    let formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });
    formData.append('upload_preset', 'ml_default'); // Cloudinary preset

    const response = await fetch("https://api.cloudinary.com/v1_1/dypgxulgp/image/upload", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" }
    });

    const data = await response.json();

    if (!data.secure_url) {
      console.error('Image upload failed:', data);
      return null;
    }
    return data.secure_url;
  }

  const handleCountryChange = (text) => {
    setCountry(text);
    if (text.length > 0) {
      const filtered = countryList.filter((c) =>
        c.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleCategoryChange = (text) => {
    setCategory(text);
    if (text.length > 0) {
      const filtered = CATEGORIES.filter((cat) =>
        cat.label.toLowerCase().includes(text.toLowerCase()) // case-insensitive filter
      );
      setFilteredCategories(filtered);
      setShowCategoryDropdown(true);
    } else {
      setFilteredCategories([]); // Clear filter when input is empty
      setShowCategoryDropdown(false); // Hide dropdown when input is empty
    }
  };

  const handleSubmit = async () => {
    if (!title || !article || !category ) {
      alert('Please fill all required fields: Title, Content, Category, ');
      return;
    }

    setLoading(true);
    let imageUrl = null;

    if (image) {
      imageUrl = await uploadImage(image);
    }

    const postData = {
      title,
      content: article,
      image: imageUrl,
      category,
      country,
      important: important === true,
    }


    try {
      await createPost(postData);
      router.back(); 
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false)
    }

  }


  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={hp(3.5)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit}>
        <Text>Post</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : hp(2)}
      >
        {/* Dropdowns outside ScrollView */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Category"
            value={category}
            onChangeText={handleCategoryChange}
            selectionColor="#333"
          />
          {showCategoryDropdown && (
            <FlatList
              data={filteredCategories.length > 0 ? filteredCategories : CATEGORIES}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCategory(item.label);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text>{item.label}</Text> 
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          )}
        </View>

                

        <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Country"
              value={country}
              onChangeText={handleCountryChange}
              selectionColor="#333"
            />
            {showDropdown && (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item, index) => `${item}-${index}`}  // Ensure unique keys
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setCountry(item);
                      setShowDropdown(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdownList}
              />
              )}
          </View>

        <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
          <DropDownPicker
            open={openImportant}
            value={important}
            items={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
            setOpen={setOpenImportant}
            setValue={setImportant}
            placeholder="Is it Important?"
            style={styles.dropdown}
          />
        </View>

        {/* ScrollView for the rest of the content */}
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!openCategory && !openCountry && !openImportant} 
        >
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>Pick an Image</Text>}
          </TouchableOpacity>

          <TextInput 
            style={styles.input} 
            placeholder="Enter article title" 
            value={title} 
            onChangeText={setTitle} 
            selectionColor="#333"
          />

          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder={`${user.name}, Write your article here...`} 
            multiline 
            numberOfLines={5} 
            value={article} 
            onChangeText={setArticle} 
            selectionColor="#333"
          />

          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
              {loading ? (
                <ActivityIndicator color="#fff" /> // Show ActivityIndicator when loading
              ) : (
                <Text style={styles.submitText}>Submit</Text>
              )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
      justifyContent: 'space-between',
    },
    container: {
      flexGrow: 1,
      padding: wp(4),
    },
    dropdown: {
      marginBottom: hp(1),
      borderColor: '#ddd',
    },
    dropdownWrapper: {
      marginBottom: hp(1),
      zIndex: 1, // Default, overridden by inline styles above
    },
    imagePicker: {
      height: hp(20),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: hp(2),
      borderRadius: 10, // Added border radius for better design
      backgroundColor: '#f9f9f9', // Added background color for better design
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10, // Added border radius for better design
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: hp(1.8),
      borderRadius: 10, // Increased border radius for better design
      marginBottom: hp(2),
      backgroundColor: '#f9f9f9', // Added background color for better design
    },
    textArea: {
      height: hp(15),
      textAlignVertical: 'top',
    },
    submitBtn: {
      backgroundColor: '#333', // Updated background color to #333
      padding: hp(2),
      borderRadius: 10, // Increased border radius for better design
      alignItems: 'center',
      marginTop: hp(2), // Added margin top for better spacing
    },
    submitText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: hp(2), // Increased font size for better readability
    },
    inputContainer: {
      position: 'relative',
      marginBottom: hp(0.5),
    },
    dropdownList: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      maxHeight: 150,
      zIndex: 1100
    },
    countryItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
  });