import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:4000/api/v1';
    return 'http://10.0.2.2:4000/api/v1'; // Standard Android Emulator / local dev API URL
  }

  static Future<Map<String, String>> _headers({bool withAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (withAuth) {
      final token = await StorageService.getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // ===========================================================================
  // AUTHENTICATION
  // ===========================================================================

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: await _headers(withAuth: false),
      body: jsonEncode({'email': email, 'password': password}),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> register({
    required String fullName,
    required String email,
    required String password,
    String? phone,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: await _headers(withAuth: false),
      body: jsonEncode({
        'fullName': fullName,
        'email': email,
        'password': password,
        if (phone != null && phone.isNotEmpty) 'phone': phone,
        'role': 'STUDENT',
      }),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> sendOtp(String phone) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/send-otp'),
      headers: await _headers(withAuth: false),
      body: jsonEncode({'phone': phone}),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> verifyOtp({
    required String phone,
    required String otp,
    String? fullName,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-otp'),
      headers: await _headers(withAuth: false),
      body: jsonEncode({
        'phone': phone,
        'otp': otp,
        'fullName': ?fullName,
      }),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: await _headers(),
    );
    return _parseResponse(response);
  }

  // ===========================================================================
  // STUDENT PROFILE & SKILLS PERSISTENCE
  // ===========================================================================

  static Future<Map<String, dynamic>> getStudentProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/students/me'),
      headers: await _headers(),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> updateStudentProfile(Map<String, dynamic> updates) async {
    final response = await http.put(
      Uri.parse('$baseUrl/students/me'),
      headers: await _headers(),
      body: jsonEncode(updates),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> updateSkills(List<Map<String, dynamic>> skills) async {
    final response = await http.put(
      Uri.parse('$baseUrl/students/me/skills'),
      headers: await _headers(),
      body: jsonEncode({'skills': skills}),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> addEducation(Map<String, dynamic> edu) async {
    final response = await http.post(
      Uri.parse('$baseUrl/students/me/education'),
      headers: await _headers(),
      body: jsonEncode(edu),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> deleteEducation(String eduId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/students/me/education/$eduId'),
      headers: await _headers(),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> updatePreferences(Map<String, dynamic> prefs) async {
    final response = await http.put(
      Uri.parse('$baseUrl/students/me/preferences'),
      headers: await _headers(),
      body: jsonEncode(prefs),
    );
    return _parseResponse(response);
  }

  // ===========================================================================
  // PROJECTS & WORK SAMPLES (PROOFS)
  // ===========================================================================

  static Future<Map<String, dynamic>> addProject(Map<String, dynamic> project) async {
    final response = await http.post(
      Uri.parse('$baseUrl/students/me/projects'),
      headers: await _headers(),
      body: jsonEncode(project),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> deleteProject(String projectId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/students/me/projects/$projectId'),
      headers: await _headers(),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> addWorkSample(Map<String, dynamic> sample) async {
    final response = await http.post(
      Uri.parse('$baseUrl/students/me/work-samples'),
      headers: await _headers(),
      body: jsonEncode(sample),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> deleteWorkSample(String sampleId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/students/me/work-samples/$sampleId'),
      headers: await _headers(),
    );
    return _parseResponse(response);
  }

  // ===========================================================================
  // CV & FILE STORAGE
  // ===========================================================================

  static Future<Map<String, dynamic>> getSignedUploadUrl({
    required String fileName,
    required String fileType,
    required int fileSize,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/storage/upload-url'),
      headers: await _headers(),
      body: jsonEncode({
        'fileName': fileName,
        'fileType': fileType,
        'fileSize': fileSize,
      }),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> confirmCvUpload({
    required String fileUrl,
    required String fileKey,
    required String fileName,
    required int fileSize,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/students/me/cv'),
      headers: await _headers(),
      body: jsonEncode({
        'fileUrl': fileUrl,
        'fileKey': fileKey,
        'fileName': fileName,
        'fileSize': fileSize,
      }),
    );
    return _parseResponse(response);
  }

  // ===========================================================================
  // PAYMENTS & ₹99 ACTIVATION
  // ===========================================================================

  static Future<Map<String, dynamic>> createPaymentOrder() async {
    final response = await http.post(
      Uri.parse('$baseUrl/payments/create-order'),
      headers: await _headers(),
      body: jsonEncode({
        'amount': 9900,
        'currency': 'INR',
      }),
    );
    return _parseResponse(response);
  }

  static Future<Map<String, dynamic>> verifyPayment({
    required String orderId,
    required String paymentId,
    required String signature,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/payments/verify-payment'),
      headers: await _headers(),
      body: jsonEncode({
        'orderId': orderId,
        'paymentId': paymentId,
        'signature': signature,
      }),
    );
    return _parseResponse(response);
  }

  // ===========================================================================
  // TALENT DISCOVERY
  // ===========================================================================

  static Future<Map<String, dynamic>> searchTalents({
    String? q,
    String? role,
    int page = 1,
    int limit = 12,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      if (q != null && q.isNotEmpty) 'q': q,
      if (role != null && role.isNotEmpty) 'roles': role,
    };

    final uri = Uri.parse('$baseUrl/discovery/talents').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: await _headers(withAuth: false));
    return _parseResponse(response);
  }

  // ===========================================================================
  // PRIVATE RESPONSE PARSER (No Fake Fallbacks)
  // ===========================================================================

  static Map<String, dynamic> _parseResponse(http.Response response) {
    Map<String, dynamic> body;
    try {
      body = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      body = {'error': 'Invalid server response: ${response.statusCode}'};
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else {
      final errorMessage = body['error'] ?? body['message'] ?? 'API Error (${response.statusCode})';
      throw ApiException(errorMessage, response.statusCode);
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}
