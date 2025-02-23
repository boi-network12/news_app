import { ScrollView, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import NewsList from '../components/NewsList';
import { Ionicons } from "@expo/vector-icons";
import CategoryTabs from '../components/CategoryTabs';
import NewsToday from '../components/NewsToday';
import { Link, useRouter } from "expo-router";
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { PostContext } from '../context/PostContext';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext);
  const { posts, loading, fetchPosts } = useContext(PostContext); 
  const { notifications, fetchNotifications } = useContext(NotificationContext);
  const router = useRouter();

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(); 
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchPosts]);

  // function to filter posts by category
  const filterPostsCategory = (category) => {
    if (category === "All News") {
      return posts || [];
    } else if (category === "Trending") {
      return posts.slice().sort((a, b) => b.likesCount - a.likesCount) || [];
    } else {
      return posts.filter(post => post.category === category) || [];
    }
  };

  // function to handle search query
  const searchPosts = () => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPosts = searchQuery ? searchPosts() : filterPostsCategory(selectedCategory);

  

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="transparent" // Hides default spinner
          colors={["transparent"]}
          style={styles.refreshControl}
        />
      }
    >
      <View style={styles.topView}>
        <View>
          <Link href={user ? "/profile" : "/login"} asChild>
            <TouchableOpacity>
              <Text style={styles.smallText}>{user ? `Hi ${user.name}` : "Login"}</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.title}>Let's Explore Today's News</Text>
        </View>
        <View style={styles.iconContainer}>
          {user?.role === "admin" && (
            <Link href="/post" asChild>
              <TouchableOpacity style={styles.postIcon}>
                <Ionicons name="create-outline" color="#333" size={20} />
              </TouchableOpacity>
            </Link>
          )}
          <Link href={user ? "/notification" : "/login"} asChild>
            <TouchableOpacity style={styles.notificationIconContainer}>
              <Ionicons name="notifications-outline" color="#333" size={20} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryTabs onSelectCategory={setSelectedCategory} />
      {!searchQuery && selectedCategory === "All News" && (
        <>
          <Text style={styles.sectionTitle}>News Today</Text>
          <NewsToday posts={posts} loading={loading} />
        </>
      )}
      <Text style={styles.sectionTitle}>{selectedCategory}</Text>
      <NewsList
        posts={filteredPosts}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
      },
      topView: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: hp(2.2),
        marginVertical: hp(2),
        justifyContent: "space-between"
      },
      smallText: {
        fontSize: hp(1.6),
        fontWeight: 300
      },
      title: {
        fontSize: hp(2.8),
        fontWeight: 300
      },
      sectionTitle: {
        fontSize: hp(2),
        fontWeight: 'bold',
        marginLeft: hp(2.8),
        marginTop: hp(1.6),
      },
      notificationIconContainer: {
        position: 'relative',
      },
      notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        width: hp(2),
        height: hp(2),
        borderRadius: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
      },
      notificationBadgeText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: 'bold',
      },
      iconContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      postIcon: {
        marginRight: hp(2), 
      }
})