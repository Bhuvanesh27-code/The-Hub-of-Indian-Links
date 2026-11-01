# Security Specification & Data Invariants for Bright Indian

## 1. Data Invariants

1. **Public Read Integrity**:
   - `government_links` and `proverbs` are publicly readable by any citizen (authenticated or unauthenticated) so that all visitors can discover official portals and read wisdom.
   - Citizen write access (create/update/delete) on `government_links`, `proverbs`, and `admins` is strictly restricted to authenticated and verified Admins (`isAdmin()`).
2. **Citizen Reporting (`broken_link_reports`)**:
   - Any visitor can submit a broken link report (`allow create`).
   - The payload must adhere strictly to field schemas: `linkName`, `issueType`, `status == 'pending'`, string size limits, and no injected privilege fields.
   - Only admins can read, update or delete reports.
3. **Admin Identification**:
   - Admin access is granted only if the authenticated user has an entry in `/databases/$(database)/documents/admins/$(request.auth.uid)` OR is authenticated via verified email matching the designated platform admin emails (`bhuvaneshvpm406@gmail.com` or `vijisiva1977@gmail.com`).
4. **Key Integrity & Anti-Tampering**:
   - Mutations on `government_links` must validate required keys (`id`, `name`, `url`, `governmentLevel`, `category`, `verificationStatus`) and cannot inject arbitrary unvetted fields.
   - String sizes are bounded to protect against denial-of-wallet and database bloat.

## 2. The Dirty Dozen Payloads (Forbidden Actions)

1. Unauthenticated write to `/government_links/{id}` (Must fail: PERMISSION_DENIED).
2. Authenticated non-admin write to `/government_links/{id}` (Must fail: PERMISSION_DENIED).
3. Admin update injecting 500KB garbage string in `name` (Must fail: string length violation).
4. Unauthenticated citizen creating a broken link report with `status: 'resolved'` (Must fail: status must start as 'pending').
5. Citizen reading all `/broken_link_reports` submitted by other users (Must fail: only admin can read list of reports).
6. Non-admin modifying `/admins/{uid}` to escalate their own role (Must fail: PERMISSION_DENIED).
7. Delete operation on `/government_links/{id}` by non-admin (Must fail: PERMISSION_DENIED).
8. Attempting to bypass path validation using illegal characters in doc ID (Must fail: isValidId check).
9. Attempting to create an admin entry with an unverified email token (Must fail).
10. Unauthenticated or non-admin attempting to delete or alter a proverb (Must fail: PERMISSION_DENIED).
11. Injecting shadow fields into `government_links` like `__debug_role: 'superadmin'` (Must fail: strict key allowlist).
12. Attempt to list the entire `/admins` collection as an anonymous user (Must fail: PERMISSION_DENIED).
