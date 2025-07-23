// Sistema de notificaciones automáticas
// Este script se ejecutaría como un cron job o función serverless

import { supabase } from "../lib/supabase.js"

async function checkOverdueServices() {
  try {
    // Verificar servicios vencidos
    const { data: overdueServices } = await supabase
      .from("workshop_services")
      .select(`
        id, folio_id, estimated_completion_date, assigned_technician_id, received_by_id,
        client:clients(name)
      `)
      .lt("estimated_completion_date", new Date().toISOString().split("T")[0])
      .not("status", "in", '("completed", "delivered", "cancelled")')

    // Crear notificaciones para servicios vencidos
    for (const service of overdueServices || []) {
      // Notificar al técnico asignado
      if (service.assigned_technician_id) {
        await supabase.from("notifications").insert({
          user_id: service.assigned_technician_id,
          title: "Servicio Vencido",
          message: `El servicio ${service.folio_id} para ${service.client.name} está vencido. Revisar urgentemente.`,
          type: "overdue",
          reference_type: "workshop_service",
          reference_id: service.id,
        })
      }

      // Notificar al colaborador que recibió el servicio
      if (service.received_by_id) {
        await supabase.from("notifications").insert({
          user_id: service.received_by_id,
          title: "Servicio Vencido",
          message: `El servicio ${service.folio_id} que recibiste está vencido. Contactar al técnico.`,
          type: "overdue",
          reference_type: "workshop_service",
          reference_id: service.id,
        })
      }
    }

    console.log(`Procesados ${overdueServices?.length || 0} servicios vencidos`)
  } catch (error) {
    console.error("Error checking overdue services:", error)
  }
}

async function checkUpcomingDeadlines() {
  try {
    // Verificar servicios que vencen mañana
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data: upcomingServices } = await supabase
      .from("workshop_services")
      .select(`
        id, folio_id, estimated_completion_date, assigned_technician_id, received_by_id,
        client:clients(name)
      `)
      .eq("estimated_completion_date", tomorrow.toISOString().split("T")[0])
      .not("status", "in", '("completed", "delivered", "cancelled")')

    // Crear notificaciones para servicios próximos a vencer
    for (const service of upcomingServices || []) {
      // Notificar al técnico asignado
      if (service.assigned_technician_id) {
        await supabase.from("notifications").insert({
          user_id: service.assigned_technician_id,
          title: "Servicio Próximo a Vencer",
          message: `El servicio ${service.folio_id} para ${service.client.name} vence mañana. Revisar progreso.`,
          type: "deadline",
          reference_type: "workshop_service",
          reference_id: service.id,
        })
      }

      // Notificar al colaborador que recibió el servicio
      if (service.received_by_id) {
        await supabase.from("notifications").insert({
          user_id: service.received_by_id,
          title: "Servicio Próximo a Vencer",
          message: `El servicio ${service.folio_id} que recibiste vence mañana. Verificar estado.`,
          type: "deadline",
          reference_type: "workshop_service",
          reference_id: service.id,
        })
      }
    }

    console.log(`Procesados ${upcomingServices?.length || 0} servicios próximos a vencer`)
  } catch (error) {
    console.error("Error checking upcoming deadlines:", error)
  }
}

async function checkLongDiagnosisTime() {
  try {
    // Verificar servicios que llevan más de 24 horas en diagnóstico
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: longDiagnosisServices } = await supabase
      .from("workshop_services")
      .select(`
        id, folio_id, diagnosis_start_date, assigned_technician_id, received_by_id,
        client:clients(name)
      `)
      .eq("status", "diagnosing")
      .lt("diagnosis_start_date", yesterday.toISOString())

    // Crear notificaciones para diagnósticos demorados
    for (const service of longDiagnosisServices || []) {
      // Notificar al técnico asignado
      if (service.assigned_technician_id) {
        await supabase.from("notifications").insert({
          user_id: service.assigned_technician_id,
          title: "Diagnóstico Demorado",
          message: `El diagnóstico del servicio ${service.folio_id} lleva más de 24 horas. Completar diagnóstico.`,
          type: "warning",
          reference_type: "workshop_service",
          reference_id: service.id,
        })
      }

      // Notificar al colaborador que recibió el servicio
      if (service.received_by_id) {
        await supabase.from("notifications").insert({
          user_id: service.received_by_id,
          title: "Diagnóstico Demorado",
          message: `El diagnóstico del servicio ${service.folio_id} está demorado. Consultar con el técnico.`,
          type: "warning",
          reference_type: "workshop_service",
          reference_id: service.id,
        })
      }
    }

    console.log(`Procesados ${longDiagnosisServices?.length || 0} diagnósticos demorados`)
  } catch (error) {
    console.error("Error checking long diagnosis time:", error)
  }
}

// Función principal que ejecuta todas las verificaciones
async function runNotificationSystem() {
  console.log("Iniciando sistema de notificaciones...")

  await checkOverdueServices()
  await checkUpcomingDeadlines()
  await checkLongDiagnosisTime()

  console.log("Sistema de notificaciones completado")
}

// Ejecutar el sistema (esto se llamaría desde un cron job)
runNotificationSystem()
