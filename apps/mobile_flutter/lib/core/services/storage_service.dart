import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/domain_constants.dart';

class StorageService {
  static const String _tokenKey = 'fresher2work_auth_token';
  static const String _userKey = 'fresher2work_user_data';
  static const String _flaggedIssueKey = 'fresher2work_flagged_issue';
  static const String _activatedKey = 'fresher2work_activated';
  static const String _selectedDomainKey = 'fresher2work_selected_domain';
  static const String _proofsPrefix = 'fresher2work_proofs_';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  static Future<void> saveUser(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(userData));
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final str = prefs.getString(_userKey);
    if (str != null) {
      try {
        return jsonDecode(str) as Map<String, dynamic>;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  static Future<String> getSelectedDomain() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_selectedDomainKey) ?? 'digital_marketing';
  }

  static Future<void> setSelectedDomain(String domainId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_selectedDomainKey, domainId);
  }

  static Future<bool> isActivated() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_activatedKey) ?? false;
  }

  static Future<void> setActivated(bool val) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_activatedKey, val);
  }

  static Future<String?> getFlaggedIssue() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_flaggedIssueKey) ??
        "Super Admin Notice: Degree certificate is blurred. Re-upload clean scan to maintain verified badge in recruiter search.";
  }

  static Future<void> clearFlaggedIssue() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_flaggedIssueKey);
  }

  // --- Proofs Persistence (Delete, Add, Reset) ---
  static Future<List<ProofItem>> getStoredProofs(String domainId) async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('$_proofsPrefix$domainId');
    if (data != null) {
      try {
        final list = jsonDecode(data) as List;
        return list.map((item) => ProofItem.fromJson(Map<String, dynamic>.from(item))).toList();
      } catch (_) {
        return DomainConstants.getDomainById(domainId).sampleProjects;
      }
    }
    return DomainConstants.getDomainById(domainId).sampleProjects;
  }

  static Future<void> saveStoredProofs(String domainId, List<Map<String, dynamic>> proofs) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('$_proofsPrefix$domainId', jsonEncode(proofs));
  }

  static Future<void> resetStoredProofs(String domainId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('$_proofsPrefix$domainId');
  }
}
