import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import '../../../core/constants/app_colors.dart';

class UploadedFileModel {
  final String name;
  final String size;
  final String extension;
  final bool isUploaded;

  UploadedFileModel({
    required this.name,
    required this.size,
    required this.extension,
    this.isUploaded = true,
  });
}

class FileUploadZone extends StatefulWidget {
  final List<UploadedFileModel> initialFiles;
  final Function(List<UploadedFileModel>) onFilesChanged;
  final String title;
  final String hint;
  final bool isResumeMode;

  const FileUploadZone({
    super.key,
    required this.initialFiles,
    required this.onFilesChanged,
    this.title = 'Upload Proof Documents & Screenshots',
    this.hint = 'Supports PNG, JPG, PDF, DOC, & CV (Up to 25MB each)',
    this.isResumeMode = false,
  });

  @override
  State<FileUploadZone> createState() => _FileUploadZoneState();
}

class _FileUploadZoneState extends State<FileUploadZone> {
  late List<UploadedFileModel> _files;
  bool _isPicking = false;

  @override
  void initState() {
    super.initState();
    _files = List.from(widget.initialFiles);
  }

  @override
  void didUpdateWidget(covariant FileUploadZone oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialFiles != oldWidget.initialFiles) {
      setState(() {
        _files = List.from(widget.initialFiles);
      });
    }
  }

  Future<void> _pickFiles() async {
    setState(() => _isPicking = true);
    try {
      final result = await FilePicker.platform.pickFiles(
        allowMultiple: !widget.isResumeMode,
        type: FileType.custom,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      );

      if (result != null && result.files.isNotEmpty) {
        for (var f in result.files) {
          final sizeKb = (f.size / 1024).toStringAsFixed(1);
          final sizeStr = f.size > 1024 * 1024
              ? '${(f.size / (1024 * 1024)).toStringAsFixed(1)} MB'
              : '$sizeKb KB';
          final ext = f.extension?.toUpperCase() ?? 'FILE';
          
          if (widget.isResumeMode) {
            _files = [
              UploadedFileModel(
                name: f.name,
                size: sizeStr,
                extension: ext,
                isUploaded: true,
              )
            ];
          } else {
            _files.add(
              UploadedFileModel(
                name: f.name,
                size: sizeStr,
                extension: ext,
                isUploaded: true,
              ),
            );
          }
        }
        widget.onFilesChanged(_files);
      }
    } catch (_) {
      // In case picker is cancelled or restricted in restricted environments
    } finally {
      if (mounted) {
        setState(() => _isPicking = false);
      }
    }
  }

  void _removeFile(int index) {
    setState(() {
      _files.removeAt(index);
    });
    widget.onFilesChanged(_files);
  }

  Color _getBadgeColor(String ext) {
    switch (ext.toUpperCase()) {
      case 'PDF':
        return Colors.red.shade700;
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return Colors.green.shade700;
      case 'DOC':
      case 'DOCX':
        return AppColors.bluePrimary;
      default:
        return AppColors.textMuted;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              widget.title,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12.5,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
            ),
            if (_files.isNotEmpty)
              Text(
                '${_files.length} file(s) attached',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.bluePrimary,
                ),
              ),
          ],
        ),
        const SizedBox(height: 8),

        // Drop Zone Card
        GestureDetector(
          onTap: _isPicking ? null : _pickFiles,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
            decoration: BoxDecoration(
              color: AppColors.cardBlue.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppColors.bluePrimary.withValues(alpha: 0.4),
                style: BorderStyle.solid,
                width: 1.5,
              ),
            ),
            child: Column(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.bluePrimary.withValues(alpha: 0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: _isPicking
                      ? const Center(
                          child: SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppColors.bluePrimary,
                            ),
                          ),
                        )
                      : const Icon(
                          Icons.cloud_upload_outlined,
                          color: AppColors.bluePrimary,
                          size: 24,
                        ),
                ),
                const SizedBox(height: 10),
                Text(
                  widget.isResumeMode ? 'Upload Resume / CV (PDF)' : 'Upload Proof Files from Device',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.hint,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),

                // Manual Pick Button
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                  decoration: BoxDecoration(
                    color: AppColors.bluePrimary,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.folder_open_rounded, size: 14, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        'Select File from Device',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Uploaded File List Preview
        if (_files.isNotEmpty) ...[
          const SizedBox(height: 12),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _files.length,
            itemBuilder: (context, index) {
              final file = _files[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getBadgeColor(file.extension).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        file.extension,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w900,
                          color: _getBadgeColor(file.extension),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            file.name,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Row(
                            children: [
                              Text(
                                file.size,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10.5,
                                  color: AppColors.textLight,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.check_circle_rounded, size: 12, color: AppColors.success),
                              const SizedBox(width: 3),
                              Text(
                                'Selected',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.success,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 18, color: AppColors.textLight),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () => _removeFile(index),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ],
    );
  }
}
