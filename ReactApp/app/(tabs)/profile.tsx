import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useStorageState } from "@/utils/useStorageState";
import { jwtDecode } from "jwt-decode";
import "../../global.css";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useStorageState("token");
  const [userData, setUserData] = useState({
    email: "",
    role: "",
    username: "",
  });

  const getUser = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!token[1]) return;

      const decodedToken = jwtDecode(token[1]);
      const userId = decodedToken["sub"];

      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token[1]}`,
          },
        }
      );

      setUserData({
        email: data.data.email,
        role: data.data.role,
        username: data.data.username,
      });
      setUsername(data.data.username);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching user data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");

      const decodedToken = jwtDecode(token[1]);
      const userId = decodedToken["sub"];

      const { data } = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${userId}`,
        {
          user: {
            username: username,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token[1]}`,
          },
        }
      );

      setUsername(data.data.username);
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while updating the username"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token[1]) {
      getUser();
    }
  }, [token]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text className="text-3xl font-bold mb-6 text-gray-900">
              Profile
            </Text>

            <View className="bg-white rounded-lg p-4 shadow-sm">
              <View className="mb-6 border-b border-gray-200 pb-6">
                <Text className="text-lg font-medium text-gray-700 mb-2">
                  Username
                </Text>
                {isEditing ? (
                  <View className="space-y-2">
                    <View className="flex-row space-x-2">
                      <TextInput
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-base bg-white"
                        value={username}
                        onChangeText={setUsername}
                        editable={!isLoading}
                        placeholder="Enter username"
                      />
                      <TouchableOpacity
                        className={`px-6 py-3 bg-blue-500 rounded-lg justify-center ${
                          isLoading ? "opacity-50" : ""
                        }`}
                        onPress={handleSave}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white text-base font-medium">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    {error ? (
                      <Text className="text-red-500 text-sm">{error}</Text>
                    ) : null}
                  </View>
                ) : (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xl text-gray-900">{username}</Text>
                    <TouchableOpacity
                      onPress={() => setIsEditing(true)}
                      className="p-2"
                    >
                      <Text className="text-blue-500 text-base">Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View className="mb-6 border-b border-gray-200 pb-6">
                <Text className="text-lg font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <Text className="text-xl text-gray-900">{userData.email}</Text>
              </View>

              <View className="mb-6">
                <Text className="text-lg font-medium text-gray-700 mb-2">
                  Role
                </Text>
                <Text className="text-xl text-gray-900">{userData.role}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
