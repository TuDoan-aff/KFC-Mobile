import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import BASE_URL from '../config.js';

const ChatBotScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', role: 'bot', text: 'Xin chào 👋 Tôi có thể hỗ trợ gì cho bạn?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch(BASE_URL + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      const botMessage = {
        id: Date.now().toString() + '_bot',
        role: 'bot',
        text: data.reply,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: 'err', role: 'bot', text: '❌ Lỗi kết nối server' },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.role === 'user' ? styles.user : styles.bot,
      ]}
    >
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={{ color: '#fff' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatBotScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  message: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  text: { fontSize: 16 },

  inputBox: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 20,
  },
});
