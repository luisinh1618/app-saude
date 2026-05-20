import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function PatientDoctorsScreen() {
  const router = useRouter();

  const [doctors, setDoctors] =
    useState<any[]>([]);

  const [specialties, setSpecialties] =
    useState<any[]>([]);

  const [
    selectedSpecialtyId,
    setSelectedSpecialtyId,
  ] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadSpecialties() {
    const response =
      await apiService.getSpecialties();

    setSpecialties(
      response.specialties || []
    );
  }

  async function loadApprovedDoctors() {
    try {
      setIsLoading(true);

      const response =
        await apiService.getApprovedDoctors();

      setDoctors(
        response.doctors || []
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function filterBySpecialty(
    specialtyId: string
  ) {
    try {
      setIsLoading(true);

      setSelectedSpecialtyId(
        specialtyId
      );

      const response =
        await apiService.getApprovedDoctorsBySpecialty(
          specialtyId
        );

      setDoctors(
        response.doctors || []
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSpecialties();
    loadApprovedDoctors();
  }, []);

  return (
    <ScreenContainer>

      <AppHeader
        title="Médicos Disponíveis"
      />

      <Text style={styles.subtitle}>
        Filtrar por especialidade
      </Text>

      <FlatList
        horizontal
        data={specialties}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={
          false
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecialtyId ===
                item.id &&
                styles.filterButtonActive,
            ]}
            onPress={() =>
              filterBySpecialty(item.id)
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedSpecialtyId ===
                  item.id &&
                  styles.filterTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Limpar filtro"
        onPress={() => {
          setSelectedSpecialtyId("");

          loadApprovedDoctors();
        }}
      />

      {isLoading ? <Loading /> : null}

      {!isLoading &&
      doctors.length === 0 ? (
        <Text style={styles.empty}>
          Nenhum médico encontrado.
        </Text>
      ) : null}

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname:
                  "/patient/doctor-details",
                params: {
                  doctorId: item.id,
                  name: item.name || "",
                  crm: item.crm || "",
                  specialty:
                    item.specialty || "",
                  phone:
                    item.phone || "",
                  biography:
                    item.biography || "",
                },
              } as any)
            }
          >
            <Card>
              <Text style={styles.name}>
                {item.name || "Médico"}
              </Text>

              <Text style={styles.info}>
                CRM:{" "}
                {item.crm ||
                  "Não informado"}
              </Text>

              <Text style={styles.info}>
                Especialidade:{" "}
                {item.specialty ||
                  "Não informada"}
              </Text>

              <Text style={styles.info}>
                Telefone:{" "}
                {item.phone ||
                  "Não informado"}
              </Text>

              {item.biography ? (
                <Text style={styles.bio}>
                  {item.biography}
                </Text>
              ) : null}
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },

  filterButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },

  filterButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterText: {
    color: "#374151",
    fontWeight: "700",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  info: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  bio: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});