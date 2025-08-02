import { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { type User, type Experience, type Education, type Project } from "@shared/schema";

interface ResumeTemplateProps {
  user: User;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  templateId: string;
}

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#2563EB',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
    textTransform: 'uppercase',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 3,
  },
  text: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    fontSize: 9,
    backgroundColor: '#f3f4f6',
    padding: 3,
    borderRadius: 3,
    color: '#374151',
  },
});

// Modern Professional Template
const ModernTemplate = ({ user, experience = [], education = [], projects = [] }: ResumeTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{user.fullName}</Text>
        {user.email && <Text style={styles.contact}>Email: {user.email}</Text>}
        {user.phone && <Text style={styles.contact}>Phone: {user.phone}</Text>}
        {user.location && <Text style={styles.contact}>Location: {user.location}</Text>}
        {user.linkedin && <Text style={styles.contact}>LinkedIn: {user.linkedin}</Text>}
        {user.github && <Text style={styles.contact}>GitHub: {user.github}</Text>}
      </View>

      {/* Summary */}
      {user.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.text}>{user.summary}</Text>
        </View>
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <View style={styles.skillsContainer}>
            {user.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={[styles.text, { fontWeight: 'bold' }]}>
                {exp.position} at {exp.company}
              </Text>
              <Text style={[styles.text, { fontSize: 9, color: '#6b7280' }]}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              {exp.description && <Text style={styles.text}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={[styles.text, { fontWeight: 'bold' }]}>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </Text>
              <Text style={styles.text}>{edu.institution}</Text>
              <Text style={[styles.text, { fontSize: 9, color: '#6b7280' }]}>
                {edu.startDate} - {edu.endDate}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={[styles.text, { fontWeight: 'bold' }]}>
                {project.name}
              </Text>
              {project.description && <Text style={styles.text}>{project.description}</Text>}
              {project.technologies && project.technologies.length > 0 && (
                <View style={[styles.skillsContainer, { marginTop: 3 }]}>
                  {project.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={styles.skill}>{tech}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default function ResumeTemplates({ user, experience, education, projects, templateId }: ResumeTemplateProps) {
  const getTemplateComponent = () => {
    switch (templateId) {
      case 'modern':
      default:
        return (
          <ModernTemplate 
            user={user}
            experience={experience}
            education={education}
            projects={projects}
            templateId={templateId}
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-4">
      <PDFDownloadLink
        document={getTemplateComponent()}
        fileName={`${user.fullName || 'Resume'}_${templateId}.pdf`}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
      >
        {({ loading }) => (
          loading ? 'Generating PDF...' : 'Download Resume'
        )}
      </PDFDownloadLink>
    </div>
  );
}
