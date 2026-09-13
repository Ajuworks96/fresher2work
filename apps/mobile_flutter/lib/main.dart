import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/constants/app_colors.dart';
import 'features/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FresherToWorkApp());
}

class FresherToWorkApp extends StatelessWidget {
  const FresherToWorkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FresherToWork',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primaryColor: AppColors.bluePrimary,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.bluePrimary,
          primary: AppColors.bluePrimary,
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        scaffoldBackgroundColor: AppColors.scaffoldBg,
      ),
      home: const SplashScreen(),
    );
  }
}

