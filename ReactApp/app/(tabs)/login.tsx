import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.ngrok}/api/auth/signin`,
        {
          email: email,
          password: password,
        }
      );
      console.log("response");
      console.warn(response);
      if (response.status === 200) {
        Alert.alert("Success", "Logged in successfully!");
        console.log("Token:", response.data.token);
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      // @ts-ignore
      if (error.response) {
        // @ts-ignore
        Alert.alert(
          "Error",
          error.response.data.message || "Invalid credentials"
        );
      } else {
        Alert.alert("Error", "Could not connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title={"retour"} onPress={() => router.navigate("/")} />
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.authLink}>Click here to register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  authLink: {
    color: "#007bff",
    marginTop: 15,
  },
});
