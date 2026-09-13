import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/domain_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import 'email_verification_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _countryCodeController = TextEditingController(text: '+91');
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _locationController = TextEditingController();

  String _selectedDomain = 'digital_marketing';
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _loading = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _countryCodeController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    final firstName = _firstNameController.text.trim();
    final lastName = _lastNameController.text.trim();
    final phone = _phoneController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final confirmPassword = _confirmPasswordController.text.trim();
    final location = _locationController.text.trim();

    if (firstName.isEmpty || email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields')),
      );
      return;
    }

    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Passwords do not match')),
      );
      return;
    }

    setState(() => _loading = true);
    final fullName = '$firstName $lastName'.trim();
    final fullPhone = '${_countryCodeController.text.trim()}$phone';

    try {
      final res = await ApiService.register(
        fullName: fullName,
        email: email,
        password: password,
        phone: phone.isNotEmpty ? fullPhone : null,
      );

      if (res['token'] != null) {
        await StorageService.saveToken(res['token']);
      }

      final userData = res['user'] ?? {};
      userData['name'] = fullName;
      userData['location'] = location;
      userData['domain'] = _selectedDomain;

      await StorageService.saveUser(userData);
      await StorageService.setSelectedDomain(_selectedDomain);

      setState(() => _loading = false);

      if (mounted) {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => EmailVerificationScreen(
              email: email,
              domain: _selectedDomain,
              fullName: fullName,
            ),
          ),
        );
      }
    } catch (err) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.redAccent,
            content: Text(err.toString()),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      appBar: AppBar(
        backgroundColor: AppColors.scaffoldBg,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textDark),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Fresher Registration',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: AppColors.textDark,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Create Candidate Account',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textDark,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Fill your beginner credentials and choose your domain track.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13.5,
                  color: AppColors.textMuted,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),

              // First Name & Last Name Row
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('First Name *', style: _labelStyle),
                        const SizedBox(height: 6),
                        _buildInputField(
                          controller: _firstNameController,
                          hint: 'Arjun',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Last Name', style: _labelStyle),
                        const SizedBox(height: 6),
                        _buildInputField(
                          controller: _lastNameController,
                          hint: 'Krishnan',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Contact Number with Country Code
              Text('Contact Number (with Country Code) *', style: _labelStyle),
              const SizedBox(height: 6),
              Row(
                children: [
                  Container(
                    height: 52,
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _countryCodeController.text.isEmpty ? '+91' : _countryCodeController.text,
                        style: GoogleFonts.plusJakartaSans(fontSize: 13.5, fontWeight: FontWeight.w800, color: AppColors.textDark),
                        icon: const Icon(Icons.arrow_drop_down_rounded, color: AppColors.bluePrimary, size: 20),
                        items: const [
                          DropdownMenuItem(value: '+91', child: Text('+91 🇮🇳')),
                          DropdownMenuItem(value: '+1', child: Text('+1 🇺🇸')),
                          DropdownMenuItem(value: '+44', child: Text('+44 🇬🇧')),
                          DropdownMenuItem(value: '+971', child: Text('+971 🇦🇪')),
                          DropdownMenuItem(value: '+966', child: Text('+966 🇸🇦')),
                          DropdownMenuItem(value: '+65', child: Text('+65 🇸🇬')),
                          DropdownMenuItem(value: '+974', child: Text('+974 🇶🇦')),
                          DropdownMenuItem(value: '+968', child: Text('+968 🇴🇲')),
                          DropdownMenuItem(value: '+965', child: Text('+965 🇰🇼')),
                          DropdownMenuItem(value: '+973', child: Text('+973 🇧🇭')),
                          DropdownMenuItem(value: '+60', child: Text('+60 🇲🇾')),
                        ],
                        onChanged: (val) {
                          if (val != null) {
                            setState(() => _countryCodeController.text = val);
                          }
                        },
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildInputField(
                      controller: _phoneController,
                      hint: '98470 12345',
                      keyboardType: TextInputType.phone,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Email Address
              Text('Email Address *', style: _labelStyle),
              const SizedBox(height: 6),
              _buildInputField(
                controller: _emailController,
                hint: 'you@college.edu or gmail.com',
                keyboardType: TextInputType.emailAddress,
                prefixIcon: const Icon(Icons.email_outlined, color: AppColors.bluePrimary, size: 20),
              ),
              const SizedBox(height: 16),

              // Location / City
              Text('Current Location *', style: _labelStyle),
              const SizedBox(height: 6),
              _buildInputField(
                controller: _locationController,
                hint: 'e.g. Kochi, Kerala or Bangalore (Remote)',
                prefixIcon: const Icon(Icons.location_on_outlined, color: AppColors.bluePrimary, size: 20),
              ),
              const SizedBox(height: 16),

              // Specialization / Course Subject Studied
              Text('Course Subject Studied / Primary Track *', style: _labelStyle),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedDomain,
                    isExpanded: true,
                    icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.bluePrimary),
                    items: DomainConstants.domains.map((d) {
                      return DropdownMenuItem<String>(
                        value: d.id,
                        child: Row(
                          children: [
                            Icon(d.icon, size: 20, color: AppColors.bluePrimary),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                d.title,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textDark,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedDomain = val);
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Password
              Text('Password *', style: _labelStyle),
              const SizedBox(height: 6),
              _buildInputField(
                controller: _passwordController,
                hint: 'Enter strong password',
                obscureText: _obscurePassword,
                prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.bluePrimary, size: 20),
                suffixIcon: IconButton(
                  icon: Icon(_obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20, color: AppColors.textLight),
                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                ),
              ),
              const SizedBox(height: 16),

              // Confirm Password
              Text('Confirm Password *', style: _labelStyle),
              const SizedBox(height: 6),
              _buildInputField(
                controller: _confirmPasswordController,
                hint: 'Re-enter your password',
                obscureText: _obscureConfirmPassword,
                prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.bluePrimary, size: 20),
                suffixIcon: IconButton(
                  icon: Icon(_obscureConfirmPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20, color: AppColors.textLight),
                  onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                ),
              ),
              const SizedBox(height: 32),

              // Register Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _loading ? null : _handleRegister,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.bluePrimary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                  ),
                  child: _loading
                      ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text('Proceed to Email Verification →', style: GoogleFonts.plusJakartaSans(fontSize: 15, fontWeight: FontWeight.w800)),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  TextStyle get _labelStyle => GoogleFonts.plusJakartaSans(
        fontSize: 12.5,
        fontWeight: FontWeight.w700,
        color: AppColors.textDark,
      );

  Widget _buildInputField({
    required TextEditingController controller,
    required String hint,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    Widget? prefixIcon,
    Widget? suffixIcon,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.textDark),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.textLight),
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.borderSubtle)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.bluePrimary, width: 1.5)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      ),
    );
  }
}
