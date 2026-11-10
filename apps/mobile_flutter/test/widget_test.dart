import 'package:flutter_test/flutter_test.dart';
import 'package:fresher2work_mobile/main.dart';

void main() {
  testWidgets('Fresher2WorkApp smoke test loads successfully', (WidgetTester tester) async {
    // Build our app and trigger an initial frame.
    await tester.pumpWidget(const Fresher2WorkApp());

    // Allow splash timer to complete
    await tester.pump(const Duration(seconds: 4));
    await tester.pumpAndSettle();

    // Verify MaterialApp initializes properly
    expect(find.byType(Fresher2WorkApp), findsOneWidget);
  });
}
