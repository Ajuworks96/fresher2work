import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
} from 'react-native';
import {
  StudentProject,
  StudentWorkSample,
  StudentCertificate,
  WorkSampleCategory,
  StudentProfile,
} from '@fresher2work/types';
import { COLORS, BORDER_RADIUS } from '@fresher2work/ui-tokens';
import { apiClient } from '../../src/services/api';

type PortfolioTab = 'PROJECTS' | 'WORK_SAMPLES' | 'CERTIFICATES' | 'CV_RESUME';

export default function ProofOfWorkPortfolioScreen() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('PROJECTS');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [showSampleModal, setShowSampleModal] = useState(false);
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);

  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const [showCvModal, setShowCvModal] = useState(false);

  // Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projToolsInput, setProjToolsInput] = useState('');
  const [projSkillsInput, setProjSkillsInput] = useState('');
  const [projTechInput, setProjTechInput] = useState('');
  const [projDemoUrl, setProjDemoUrl] = useState('');
  const [projGithubUrl, setProjGithubUrl] = useState('');

  // Work Sample Form State
  const [sampleTitle, setSampleTitle] = useState('');
  const [sampleCategory, setSampleCategory] = useState<WorkSampleCategory>(WorkSampleCategory.GRAPHIC_DESIGN);
  const [sampleDesc, setSampleDesc] = useState('');
  const [sampleClient, setSampleClient] = useState('');
  const [sampleToolsInput, setSampleToolsInput] = useState('');
  const [sampleLink, setSampleLink] = useState('');
  const [sampleMediaUrl, setSampleMediaUrl] = useState('');

  // Certificate Form State
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // CV Form State
  const [cvUrlInput, setCvUrlInput] = useState('');
  const [cvFileNameInput, setCvFileNameInput] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await apiClient.getStudentProfile();
      setProfile(res.profile);
    } catch (err: any) {
      console.warn('Failed to load portfolio data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Project Handlers ---
  const openAddProject = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjRole('');
    setProjDesc('');
    setProjToolsInput('');
    setProjSkillsInput('');
    setProjTechInput('');
    setProjDemoUrl('');
    setProjGithubUrl('');
    setShowProjectModal(true);
  };

  const openEditProject = (p: StudentProject) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjRole(p.role || '');
    setProjDesc(p.description);
    setProjToolsInput(p.toolsUsed?.join(', ') || '');
    setProjSkillsInput(p.skillsDemonstrated?.join(', ') || '');
    setProjTechInput(p.techStack?.join(', ') || '');
    setProjDemoUrl(p.projectLink || p.liveDemoUrl || '');
    setProjGithubUrl(p.githubRepoUrl || '');
    setShowProjectModal(true);
  };

  const handleSaveProject = async () => {
    if (!projTitle.trim() || !projDesc.trim()) {
      Alert.alert('Validation Error', 'Project title and description are required.');
      return;
    }

    const techStack = projTechInput.split(',').map((t) => t.trim()).filter(Boolean);
    const toolsUsed = projToolsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const skillsDemonstrated = projSkillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    if (techStack.length === 0) {
      techStack.push('Software Architecture');
    }

    setSubmitting(true);
    try {
      const payload = {
        title: projTitle.trim(),
        description: projDesc.trim(),
        role: projRole.trim() || undefined,
        toolsUsed,
        skillsDemonstrated,
        techStack,
        projectLink: projDemoUrl.trim() || undefined,
        liveDemoUrl: projDemoUrl.trim() || undefined,
        githubRepoUrl: projGithubUrl.trim() || undefined,
        mediaUrls: [],
      };

      if (editingProjectId) {
        await apiClient.updateProject(editingProjectId, payload);
      } else {
        await apiClient.addProject(payload);
      }

      setShowProjectModal(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    Alert.alert('Remove Project', 'Are you sure you want to delete this project from your portfolio?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.deleteProject(id);
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete project');
          }
        },
      },
    ]);
  };

  // --- Work Sample Handlers ---
  const openAddSample = () => {
    setEditingSampleId(null);
    setSampleTitle('');
    setSampleCategory(WorkSampleCategory.GRAPHIC_DESIGN);
    setSampleDesc('');
    setSampleClient('');
    setSampleToolsInput('');
    setSampleLink('');
    setSampleMediaUrl('');
    setShowSampleModal(true);
  };

  const openEditSample = (s: StudentWorkSample) => {
    setEditingSampleId(s.id);
    setSampleTitle(s.title);
    setSampleCategory(s.category);
    setSampleDesc(s.description);
    setSampleClient(s.clientOrContext || '');
    setSampleToolsInput(s.toolsUsed?.join(', ') || '');
    setSampleLink(s.workLink || '');
    setSampleMediaUrl(s.mediaUrls?.[0] || '');
    setShowSampleModal(true);
  };

  const handleSaveSample = async () => {
    if (!sampleTitle.trim() || !sampleDesc.trim()) {
      Alert.alert('Validation Error', 'Sample title and description are required.');
      return;
    }

    const toolsUsed = sampleToolsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const mediaUrls = sampleMediaUrl.trim() ? [sampleMediaUrl.trim()] : [];

    setSubmitting(true);
    try {
      const payload = {
        title: sampleTitle.trim(),
        category: sampleCategory,
        description: sampleDesc.trim(),
        clientOrContext: sampleClient.trim() || undefined,
        toolsUsed,
        workLink: sampleLink.trim() || undefined,
        mediaUrls,
      };

      if (editingSampleId) {
        await apiClient.updateWorkSample(editingSampleId, payload);
      } else {
        await apiClient.addWorkSample(payload);
      }

      setShowSampleModal(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save work sample');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSample = async (id: string) => {
    Alert.alert('Remove Work Sample', 'Are you sure you want to remove this work sample?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.deleteWorkSample(id);
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to remove work sample');
          }
        },
      },
    ]);
  };

  // --- Certificate Handlers ---
  const openAddCert = () => {
    setEditingCertId(null);
    setCertName('');
    setCertOrg('');
    setCertDate('');
    setCertUrl('');
    setShowCertModal(true);
  };

  const openEditCert = (c: StudentCertificate) => {
    setEditingCertId(c.id);
    setCertName(c.name);
    setCertOrg(c.issuingOrganization);
    setCertDate(c.issueDate);
    setCertUrl(c.credentialUrl || c.certificateFileUrl || '');
    setShowCertModal(true);
  };

  const handleSaveCert = async () => {
    if (!certName.trim() || !certOrg.trim()) {
      Alert.alert('Validation Error', 'Certificate title and issuing organization are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: certName.trim(),
        issuingOrganization: certOrg.trim(),
        issueDate: certDate.trim() || '2025',
        credentialUrl: certUrl.trim() || undefined,
      };

      if (editingCertId) {
        await apiClient.updateCertificate(editingCertId, payload);
      } else {
        await apiClient.addCertificate(payload);
      }

      setShowCertModal(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save certificate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    Alert.alert('Remove Certificate', 'Are you sure you want to delete this certificate?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.deleteCertificate(id);
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete certificate');
          }
        },
      },
    ]);
  };

  // --- CV Document Handlers ---
  const handleSaveCv = async () => {
    if (!cvUrlInput.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid PDF document URL.');
      return;
    }

    if (!cvUrlInput.toLowerCase().endsWith('.pdf') && !cvUrlInput.includes('.pdf')) {
      Alert.alert('Format Error', 'CV file must be a valid PDF document. Other formats are not accepted.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.confirmCv({
        cvFileUrl: cvUrlInput.trim(),
        fileName: cvFileNameInput.trim() || 'Resume_Document.pdf',
        fileSize: 1.4 * 1024 * 1024,
      });

      setShowCvModal(false);
      setCvUrlInput('');
      setCvFileNameInput('');
      loadData();
      Alert.alert('Success', 'Existing CV PDF successfully updated and attached to your talent profile!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to confirm CV');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCv = async () => {
    Alert.alert('Delete CV', 'Are you sure you want to remove your CV document? Recruiters will not be able to view your PDF.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.deleteCv();
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to remove CV');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brand[600]} />
        <Text style={styles.loadingText}>Loading Proof of Work...</Text>
      </View>
    );
  }

  const projectsList = profile?.projects || [];
  const samplesList = profile?.workSamples || [];
  const certsList = profile?.certificates || [];
  const hasCv = Boolean(profile?.cvFileUrl);

  return (
    <View style={styles.container}>
      {/* 1. Top Segmented Tabs Header */}
      <View style={styles.topBar}>
        <Text style={styles.screenHeading}>Proof of Work Portfolio</Text>
        <Text style={styles.screenSub}>
          Showcase verified applications, creative work, credentials & existing CV.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'PROJECTS' && styles.tabButtonActive]}
            onPress={() => setActiveTab('PROJECTS')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'PROJECTS' && styles.tabButtonTextActive]}>
              💻 Projects ({projectsList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'WORK_SAMPLES' && styles.tabButtonActive]}
            onPress={() => setActiveTab('WORK_SAMPLES')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'WORK_SAMPLES' && styles.tabButtonTextActive]}>
              🎨 Work Samples ({samplesList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'CERTIFICATES' && styles.tabButtonActive]}
            onPress={() => setActiveTab('CERTIFICATES')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'CERTIFICATES' && styles.tabButtonTextActive]}>
              🏅 Certificates ({certsList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'CV_RESUME' && styles.tabButtonActive]}
            onPress={() => setActiveTab('CV_RESUME')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'CV_RESUME' && styles.tabButtonTextActive]}>
              📄 CV Document {hasCv ? '✓' : '⚠️'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 2. Tab Content Area */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- TAB 1: PROJECTS --- */}
        {activeTab === 'PROJECTS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Real Built Projects</Text>
                <Text style={styles.sectionSub}>Applications, software architecture & live repositories</Text>
              </View>
              <TouchableOpacity style={styles.addActionButton} onPress={openAddProject}>
                <Text style={styles.addActionButtonText}>+ Add Project</Text>
              </TouchableOpacity>
            </View>

            {projectsList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>💻</Text>
                <Text style={styles.emptyHeading}>No Projects Added</Text>
                <Text style={styles.emptyBody}>
                  Recruiters look for proof of execution. Add at least 2 real applications you have built.
                </Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={openAddProject}>
                  <Text style={styles.emptyBtnText}>+ Add First Project</Text>
                </TouchableOpacity>
              </View>
            ) : (
              projectsList.map((p) => (
                <View key={p.id} style={styles.portfolioCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{p.title}</Text>
                      {p.role && <Text style={styles.cardRole}>Role: {p.role}</Text>}
                    </View>
                    <View style={styles.actionIconsRow}>
                      <TouchableOpacity onPress={() => openEditProject(p)} style={styles.iconBtn}>
                        <Text style={styles.editIconText}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteProject(p.id)} style={styles.iconBtn}>
                        <Text style={styles.deleteIconText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.cardDesc}>{p.description}</Text>

                  {/* Tech Stack */}
                  {p.techStack && p.techStack.length > 0 && (
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagGroupLabel}>Tech Stack:</Text>
                      <View style={styles.chipsWrap}>
                        {p.techStack.map((tech, idx) => (
                          <View key={idx} style={styles.techChip}>
                            <Text style={styles.techChipText}>{tech}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Tools & Skills */}
                  {(p.toolsUsed?.length > 0 || p.skillsDemonstrated?.length > 0) && (
                    <View style={styles.detailRow}>
                      {p.toolsUsed?.length > 0 && (
                        <Text style={styles.subMeta}>
                          🛠️ <Text style={{ fontWeight: '700' }}>Tools:</Text> {p.toolsUsed.join(', ')}
                        </Text>
                      )}
                      {p.skillsDemonstrated?.length > 0 && (
                        <Text style={styles.subMeta}>
                          💡 <Text style={{ fontWeight: '700' }}>Skills:</Text> {p.skillsDemonstrated.join(', ')}
                        </Text>
                      )}
                    </View>
                  )}

                  {/* External Links */}
                  <View style={styles.linksFooterRow}>
                    {(p.projectLink || p.liveDemoUrl) && (
                      <Text style={styles.linkAnchor}>🌐 Live Demo: {p.projectLink || p.liveDemoUrl}</Text>
                    )}
                    {p.githubRepoUrl && (
                      <Text style={styles.linkAnchor}>💻 GitHub: {p.githubRepoUrl}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* --- TAB 2: WORK SAMPLES --- */}
        {activeTab === 'WORK_SAMPLES' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Work Samples & Creative Portfolio</Text>
                <Text style={styles.sectionSub}>Designs, marketing campaigns, branding & content</Text>
              </View>
              <TouchableOpacity style={styles.addActionButton} onPress={openAddSample}>
                <Text style={styles.addActionButtonText}>+ Add Sample</Text>
              </TouchableOpacity>
            </View>

            {samplesList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>🎨</Text>
                <Text style={styles.emptyHeading}>No Work Samples Uploaded</Text>
                <Text style={styles.emptyBody}>
                  Showcase UI designs, social media creatives, branding identity, campaign work, or copywriting.
                </Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={openAddSample}>
                  <Text style={styles.emptyBtnText}>+ Add Work Sample</Text>
                </TouchableOpacity>
              </View>
            ) : (
              samplesList.map((s) => (
                <View key={s.id} style={styles.portfolioCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{s.category.replace('_', ' ')}</Text>
                      </View>
                      <Text style={styles.cardTitle}>{s.title}</Text>
                      {s.clientOrContext && (
                        <Text style={styles.cardRole}>Context / Client: {s.clientOrContext}</Text>
                      )}
                    </View>
                    <View style={styles.actionIconsRow}>
                      <TouchableOpacity onPress={() => openEditSample(s)} style={styles.iconBtn}>
                        <Text style={styles.editIconText}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteSample(s.id)} style={styles.iconBtn}>
                        <Text style={styles.deleteIconText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.cardDesc}>{s.description}</Text>

                  {s.toolsUsed && s.toolsUsed.length > 0 && (
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagGroupLabel}>Tools Used:</Text>
                      <View style={styles.chipsWrap}>
                        {s.toolsUsed.map((tool, idx) => (
                          <View key={idx} style={styles.toolChip}>
                            <Text style={styles.toolChipText}>{tool}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {s.workLink && (
                    <View style={styles.linksFooterRow}>
                      <Text style={styles.linkAnchor}>🔗 View Asset / Link: {s.workLink}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* --- TAB 3: CERTIFICATES --- */}
        {activeTab === 'CERTIFICATES' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Certificates & Licenses</Text>
                <Text style={styles.sectionSub}>Industry certifications and course credentials</Text>
              </View>
              <TouchableOpacity style={styles.addActionButton} onPress={openAddCert}>
                <Text style={styles.addActionButtonText}>+ Add Certificate</Text>
              </TouchableOpacity>
            </View>

            {certsList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>🏅</Text>
                <Text style={styles.emptyHeading}>No Certificates Added</Text>
                <Text style={styles.emptyBody}>
                  Add AWS, Meta, Google, Coursera, or college credentials to verify your domain skills.
                </Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={openAddCert}>
                  <Text style={styles.emptyBtnText}>+ Add Certificate</Text>
                </TouchableOpacity>
              </View>
            ) : (
              certsList.map((c) => (
                <View key={c.id} style={styles.portfolioCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>🏅 {c.name}</Text>
                      <Text style={styles.cardRole}>{c.issuingOrganization} • {c.issueDate}</Text>
                    </View>
                    <View style={styles.actionIconsRow}>
                      <TouchableOpacity onPress={() => openEditCert(c)} style={styles.iconBtn}>
                        <Text style={styles.editIconText}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteCert(c.id)} style={styles.iconBtn}>
                        <Text style={styles.deleteIconText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {c.credentialUrl && (
                    <View style={styles.linksFooterRow}>
                      <Text style={styles.linkAnchor}>🔗 Verification URL: {c.credentialUrl}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* --- TAB 4: CV DOCUMENT --- */}
        {activeTab === 'CV_RESUME' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Existing CV Document (PDF)</Text>
                <Text style={styles.sectionSub}>No CV builder. Upload your pre-crafted PDF resume.</Text>
              </View>
            </View>

            {hasCv ? (
              <View style={styles.cvCard}>
                <View style={styles.cvCardHeader}>
                  <Text style={styles.cvCardIcon}>📄</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cvCardTitle}>
                      {profile?.cvFileName || 'Verified_Resume_Document.pdf'}
                    </Text>
                    <Text style={styles.cvCardMeta}>
                      Uploaded on {profile?.cvUploadedAt ? new Date(profile.cvUploadedAt).toLocaleDateString() : 'Active'} • PDF Document
                    </Text>
                  </View>
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>✓ Verified</Text>
                  </View>
                </View>

                {/* PDF Viewer Mock / In-app Preview */}
                <View style={styles.pdfPreviewFrame}>
                  <Text style={styles.pdfFrameHeader}>📄 PDF DOCUMENT PREVIEW</Text>
                  <Text style={styles.pdfFrameName}>{profile?.fullName}</Text>
                  <Text style={styles.pdfFrameHeadline}>{profile?.headline}</Text>
                  <Text style={styles.pdfFrameSub}>Recruiters can inspect, zoom, and verify this PDF in discovery.</Text>
                  <Text style={styles.pdfFrameUrl}>Secure Asset Key: {profile?.cvFileUrl}</Text>
                </View>

                {/* Actions: Replace / Delete */}
                <View style={styles.cvActionsRow}>
                  <TouchableOpacity
                    style={styles.replaceCvBtn}
                    onPress={() => {
                      setCvUrlInput(profile?.cvFileUrl || '');
                      setShowCvModal(true);
                    }}
                  >
                    <Text style={styles.replaceCvBtnText}>🔄 Replace CV (PDF)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteCvBtn} onPress={handleDeleteCv}>
                    <Text style={styles.deleteCvBtnText}>🗑️ Remove CV</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>📄</Text>
                <Text style={styles.emptyHeading}>No CV Uploaded Yet</Text>
                <Text style={styles.emptyBody}>
                  FresherToWork is strictly for talent discovery. Upload your existing pre-formatted PDF CV (Max 10MB).
                </Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => {
                    setCvUrlInput('');
                    setShowCvModal(true);
                  }}
                >
                  <Text style={styles.emptyBtnText}>+ Upload Existing CV (PDF)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ============================================================== */}
      {/* 3. MODAL: ADD / EDIT PROJECT */}
      {/* ============================================================== */}
      <Modal visible={showProjectModal} animationType="slide" transparent={false}>
        <ScrollView
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingProjectId ? 'Edit Project' : 'Add Project to Portfolio'}</Text>
            <TouchableOpacity onPress={() => setShowProjectModal(false)}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Project Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Distributed Task Queue & Dashboard"
            value={projTitle}
            onChangeText={setProjTitle}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Your Role in Project</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lead Frontend Developer / Solo Creator"
            value={projRole}
            onChangeText={setProjRole}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What was the problem? How did you build it? What architecture was used?"
            value={projDesc}
            onChangeText={setProjDesc}
            multiline
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Tech Stack (Comma Separated) *</Text>
          <TextInput
            style={styles.input}
            placeholder="React, TypeScript, Node.js, TailwindCSS"
            value={projTechInput}
            onChangeText={setProjTechInput}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Tools Used (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Figma, VS Code, Postman, Docker"
            value={projToolsInput}
            onChangeText={setProjToolsInput}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Skills Demonstrated (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="State Management, REST API Integration, Responsive Design"
            value={projSkillsInput}
            onChangeText={setProjSkillsInput}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Live Demo Web URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://myproject.vercel.app"
            value={projDemoUrl}
            onChangeText={setProjDemoUrl}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>GitHub Source Code URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://github.com/username/project"
            value={projGithubUrl}
            onChangeText={setProjGithubUrl}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.modalSubmitBtn, submitting && styles.btnDisabled]}
            onPress={handleSaveProject}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSubmitBtnText}>💾 Save Project</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* ============================================================== */}
      {/* 4. MODAL: ADD / EDIT WORK SAMPLE */}
      {/* ============================================================== */}
      <Modal visible={showSampleModal} animationType="slide" transparent={false}>
        <ScrollView
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingSampleId ? 'Edit Work Sample' : 'Add Creative Work Sample'}</Text>
            <TouchableOpacity onPress={() => setShowSampleModal(false)}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryPickerRow}>
            {[
              { label: 'Graphic Design', val: WorkSampleCategory.GRAPHIC_DESIGN },
              { label: 'Social Media', val: WorkSampleCategory.SOCIAL_MEDIA },
              { label: 'Campaign', val: WorkSampleCategory.CAMPAIGN },
              { label: 'Website', val: WorkSampleCategory.WEBSITE },
              { label: 'Branding', val: WorkSampleCategory.BRANDING },
              { label: 'Marketing', val: WorkSampleCategory.MARKETING },
              { label: 'Content', val: WorkSampleCategory.CONTENT },
              { label: 'Other', val: WorkSampleCategory.OTHER },
            ].map((cat) => (
              <TouchableOpacity
                key={cat.val}
                style={[styles.catPill, sampleCategory === cat.val && styles.catPillActive]}
                onPress={() => setSampleCategory(cat.val)}
              >
                <Text style={[styles.catPillText, sampleCategory === cat.val && styles.catPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Sample Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Fintech Brand Identity & Social Campaign"
            value={sampleTitle}
            onChangeText={setSampleTitle}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Context / Client (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Freelance Client / University Club"
            value={sampleClient}
            onChangeText={setSampleClient}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the objective, visual strategy, and outcomes achieved..."
            value={sampleDesc}
            onChangeText={setSampleDesc}
            multiline
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Tools Used (Comma Separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="Figma, Adobe Illustrator, Canva, Photoshop"
            value={sampleToolsInput}
            onChangeText={setSampleToolsInput}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Live Asset Link (Behance, Dribbble, Website)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://behance.net/gallery/..."
            value={sampleLink}
            onChangeText={setSampleLink}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.modalSubmitBtn, submitting && styles.btnDisabled]}
            onPress={handleSaveSample}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSubmitBtnText}>💾 Save Work Sample</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* ============================================================== */}
      {/* 5. MODAL: ADD / EDIT CERTIFICATE */}
      {/* ============================================================== */}
      <Modal visible={showCertModal} animationType="slide" transparent={false}>
        <ScrollView
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingCertId ? 'Edit Certificate' : 'Add Certificate'}</Text>
            <TouchableOpacity onPress={() => setShowCertModal(false)}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Certificate Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Meta Front-End Developer Professional Certificate"
            value={certName}
            onChangeText={setCertName}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Issuing Organization *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Coursera / Meta / Amazon Web Services"
            value={certOrg}
            onChangeText={setCertOrg}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Issue Year / Date</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2025"
            value={certDate}
            onChangeText={setCertDate}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Verification Link or File URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://coursera.org/verify/..."
            value={certUrl}
            onChangeText={setCertUrl}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.modalSubmitBtn, submitting && styles.btnDisabled]}
            onPress={handleSaveCert}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSubmitBtnText}>💾 Save Certificate</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* ============================================================== */}
      {/* 6. MODAL: UPLOAD / REPLACE CV (PDF) */}
      {/* ============================================================== */}
      <Modal visible={showCvModal} animationType="slide" transparent={false}>
        <ScrollView
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload / Replace Existing CV (PDF)</Text>
            <TouchableOpacity onPress={() => setShowCvModal(false)}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pdfNoticeBox}>
            <Text style={styles.pdfNoticeTitle}>⚠️ Strict PDF Upload Rules</Text>
            <Text style={styles.pdfNoticeText}>
              • File format must be PDF only (No DOCX, images or raw text).{'\n'}
              • Max file size: 10MB.{'\n'}
              • There is NO CV builder — upload your own existing resume.
            </Text>
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>CV PDF Document URL *</Text>
          <TextInput
            style={styles.input}
            placeholder="https://assets.fresher2work.com/resumes/my_cv.pdf"
            value={cvUrlInput}
            onChangeText={setCvUrlInput}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Document File Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rohan_Sharma_Resume_2026.pdf"
            value={cvFileNameInput}
            onChangeText={setCvFileNameInput}
          />

          <TouchableOpacity
            style={[styles.modalSubmitBtn, submitting && styles.btnDisabled]}
            onPress={handleSaveCv}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSubmitBtnText}>📄 Attach Verified CV (PDF)</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  topBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  screenSub: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginTop: 2,
    marginBottom: 10,
  },
  tabScroll: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[100],
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: COLORS.brand[600],
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[700],
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.neutral[400],
    marginTop: 1,
  },
  addActionButton: {
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.md,
  },
  addActionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  portfolioCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  cardRole: {
    fontSize: 12,
    color: COLORS.brand[700],
    fontWeight: '600',
    marginTop: 2,
  },
  actionIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  editIconText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[700],
  },
  deleteIconText: {
    fontSize: 14,
    color: COLORS.error.text,
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.neutral[600],
    marginTop: 8,
    lineHeight: 18,
  },
  tagGroup: {
    marginTop: 10,
  },
  tagGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.neutral[400],
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  techChip: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  techChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  toolChip: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  toolChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  detailRow: {
    marginTop: 10,
    gap: 4,
  },
  subMeta: {
    fontSize: 12,
    color: COLORS.neutral[600],
  },
  linksFooterRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    gap: 4,
  },
  linkAnchor: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent[600],
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent[50],
    borderColor: COLORS.accent[200],
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 4,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent[700],
    textTransform: 'uppercase',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginTop: 10,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  emptyBody: {
    fontSize: 13,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  cvCard: {
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  cvCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvCardIcon: {
    fontSize: 32,
  },
  cvCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  cvCardMeta: {
    fontSize: 11,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  activePill: {
    backgroundColor: COLORS.brand[50],
    borderColor: COLORS.brand[200],
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brand[800],
  },
  pdfPreviewFrame: {
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginTop: 14,
    borderStyle: 'dashed',
  },
  pdfFrameHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[700],
    letterSpacing: 0.5,
  },
  pdfFrameName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.neutral[900],
    marginTop: 6,
  },
  pdfFrameHeadline: {
    fontSize: 12,
    color: COLORS.neutral[600],
    marginTop: 2,
  },
  pdfFrameSub: {
    fontSize: 11,
    color: COLORS.neutral[400],
    marginTop: 8,
  },
  pdfFrameUrl: {
    fontSize: 10,
    color: COLORS.neutral[400],
    marginTop: 4,
    fontFamily: 'monospace',
  },
  cvActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  replaceCvBtn: {
    flex: 1,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  replaceCvBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteCvBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.neutral[100],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  deleteCvBtnText: {
    color: COLORS.error.text,
    fontSize: 12,
    fontWeight: '700',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 48,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.neutral[900],
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutral[600],
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[700],
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.neutral[900],
    backgroundColor: COLORS.neutral[50],
  },
  textArea: {
    height: 80,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  modalSubmitBtn: {
    marginTop: 20,
    backgroundColor: COLORS.brand[600],
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  modalSubmitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  catPill: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  catPillActive: {
    backgroundColor: COLORS.accent[600],
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
  catPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pdfNoticeBox: {
    backgroundColor: COLORS.warning.bg,
    borderColor: COLORS.warning.border,
    borderWidth: 1,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  pdfNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.warning.text,
  },
  pdfNoticeText: {
    fontSize: 11,
    color: COLORS.warning.text,
    marginTop: 4,
    lineHeight: 16,
  },
});
