import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchRefundStatus } from "../../store/slices/wallet/walletSlice";

const RefundStatusScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const txnParam = route?.params?.transaction;
  const refundId = txnParam?.refundDetails?.refundId || "REF78091613";

  const { selectedRefund } = useSelector((state) => state.wallet || {});

  const refund = selectedRefund || txnParam?.refundDetails || {
    refundId: "REF78091613",
    amount: "₹1,200.00",
    status: "REFUND IN PROGRESS",
    destinationAccount: {
      bankName: "State Bank of India",
      accountNumber: "**********1234",
      referenceNumber: "REV-REF-39482910",
    },
  };

  useEffect(() => {
    dispatch(fetchRefundStatus(refundId));
  }, [dispatch, refundId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Blue Top Header (Figma) */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Refund Status</Text>

        <View style={{ width: 36 }} />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Yellow/Amber Hero Banner Card (Figma) */}
        <View style={styles.heroBannerCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {refund.status || "REFUND IN PROGRESS"}
              </Text>
            </View>

            <Text style={styles.refText}>
              Ref: {refund.refundId || "REF78091613"}
            </Text>
          </View>

          <Text style={styles.estimatedLabel}>Estimated Credit Amount</Text>
          <Text style={styles.amountText}>{refund.amount || "₹1,200.00"}</Text>
        </View>

        {/* Refund Journey Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Refund Journey</Text>

          <View style={styles.timelineList}>
            {/* Step 1 */}
            <View style={styles.timelineStep}>
              <View style={styles.timelineIndicatorColumn}>
                <View style={[styles.stepDot, styles.stepDotDone]}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <View style={[styles.stepLine, styles.stepLineDone]} />
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Refund Initiated</Text>
                <Text style={styles.stepDesc}>
                  Merchant accepted refund request
                </Text>
                <Text style={styles.stepTime}>12 May, 04:00 PM</Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.timelineStep}>
              <View style={styles.timelineIndicatorColumn}>
                <View style={[styles.stepDot, styles.stepDotProcessing]}>
                  <Ionicons name="sync" size={12} color="#FFFFFF" />
                </View>
                <View style={styles.stepLine} />
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Processing by Bank</Text>
                <Text style={styles.stepDesc}>
                  Awaiting clearance from partner bank
                </Text>
                <Text style={styles.stepTime}>13 May, 10:30 AM</Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.timelineStep}>
              <View style={styles.timelineIndicatorColumn}>
                <View style={[styles.stepDot, styles.stepDotPending]}>
                  <View style={styles.pendingInnerDot} />
                </View>
              </View>

              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: "#64748B" }]}>
                  Credited to Wallet
                </Text>
                <Text style={styles.stepDesc}>
                  Funds will reflect in available balance
                </Text>
                <Text style={[styles.stepTime, { color: "#2563EB", fontWeight: "600" }]}>
                  Expected: 14 May
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Destination Account Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Destination Account</Text>

          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Bank Name</Text>
            <Text style={styles.accountValue}>
              {refund.destinationAccount?.bankName || "State Bank of India"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Account Number</Text>
            <Text style={styles.accountValue}>
              {refund.destinationAccount?.accountNumber || "**********1234"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Reference Number</Text>
            <Text style={styles.accountValue}>
              {refund.destinationAccount?.referenceNumber || "REV-REF-39482910"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  contentContainer: {
    backgroundColor: "#F8FAFC",
    padding: 18,
    paddingBottom: 40,
  },
  heroBannerCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  statusPill: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  refText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400E",
  },
  estimatedLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B45309",
  },
  amountText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#78350F",
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: "row",
    minHeight: 64,
  },
  timelineIndicatorColumn: {
    alignItems: "center",
    width: 28,
    marginRight: 12,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: {
    backgroundColor: "#16A34A",
  },
  stepDotProcessing: {
    backgroundColor: "#F59E0B",
  },
  stepDotPending: {
    backgroundColor: "#E2E8F0",
    borderWidth: 2,
    borderColor: "#CBD5E1",
  },
  pendingInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  stepLineDone: {
    backgroundColor: "#16A34A",
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  stepDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  stepTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  accountRow: {
    paddingVertical: 8,
  },
  accountLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  accountValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
});

export default RefundStatusScreen;