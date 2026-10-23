import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarIcon: () => null, tabBarLabelPosition: 'beside-icon' }}>
      <Tabs.Screen name="index" options={{ title: 'Reportes' }} />
      <Tabs.Screen name="avisos" options={{ title: 'Avisos' }} />
      <Tabs.Screen name="permisos" options={{ title: 'Permisos' }} />
    </Tabs>
  );
}
