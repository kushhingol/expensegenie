import React, { useEffect } from "react";
import { SafeAreaView, Button, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const googleLogin = async (idToken: string) => {
    try {
      // 🔥  Call Local backend API
      const API_BASE_URL = "http://localhost:4000"; // macOS emulator? See notes below

      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("✅ Backend Response:", data);
      alert(`Login Successful: ${data?.user?.email}`);
    } catch (error: any) {
      console.log("❌ Google Login Error:", error);
      alert(error?.message ?? "Login error");
    }
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      "1076619917263-oib6q4epiu9mjkf2n8cm4l13bavjafve.apps.googleusercontent.com",
    webClientId:
      "1076619917263-qk1reg51h5k9chp14jq31k7oaso8puh7.apps.googleusercontent.com",
    iosClientId:
      "1076619917263-o12edh7vo1uo719nrh2e6qff69vl1bhj.apps.googleusercontent.com",
  });

  // TODO: Use react-native-google-signin for more promising UI (Later aspect once the application API is ready)
  useEffect(() => {
    if (response) {
      try {
        const idToken = (response as any)?.["params"]?.["id_token"] || "";
        googleLogin(idToken);
      } catch (error: any) {
        console.log("❌ Google Login Error:", error);
        alert(error?.message ?? "Login error");
      }
    }
  }, [response]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 22, marginBottom: 20 }}>ExpenseGenie Login</Text>
      <Button title="Login with Google" onPress={() => promptAsync()} />
    </SafeAreaView>
  );
}
