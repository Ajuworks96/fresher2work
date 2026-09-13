import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS } from '@fresher2work/ui-tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.brand[600],
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarStyle: {
          borderTopColor: COLORS.neutral[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: COLORS.neutral[900],
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'FresherToWork',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Proof of Work',
          tabBarLabel: 'Projects',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>💼</Text>,
        }}
      />
      <Tabs.Screen
        name="activation"
        options={{
          title: 'Activation (₹99)',
          tabBarLabel: 'Activate',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚡</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
