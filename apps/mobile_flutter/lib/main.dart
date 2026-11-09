import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/constants/app_colors.dart';
import 'features/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const Fresher2WorkApp());
}

class Fresher2WorkApp extends StatelessWidget {
  const Fresher2WorkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fresher2Work',
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

