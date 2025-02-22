import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { CATEGORIES } from '../constant/categories';

const categories = ["All News", "Trending", ...CATEGORIES.map(category => category.label)];

export default function CategoryTabs({ onSelectCategory }) {
    const [activeCategory, setActiveCategory] = useState("All News");

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        onSelectCategory(category);
    }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        {categories.map((category, index) => (
            <TouchableOpacity
               key={index}
               style={[styles.categoryItem, activeCategory === category && styles.activeCategory]}
               onPress={() => handleCategoryPress(category)} 
            >
                <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
                    {category}
                </Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: hp(2),
        paddingHorizontal: hp(2),
        flexDirection: "row",
      },
      categoryItem: {
        paddingVertical: hp(1),
        paddingHorizontal: hp(2),
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
        marginRight: hp(1),
      },
      activeCategory: {
        backgroundColor: "#333",
      },
      categoryText: {
        fontSize: hp(1.8),
        color: "#333",
      },
      activeCategoryText: {
        color: "#FFF",
        fontWeight: "bold",
      },
})