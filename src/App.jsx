import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";
import Home from "./pages/Home";
import LoadingPage from "./pages/loadingPage/LoadingPage";
import ProtectedRoute from "./components/utils/ProtectedRoutes/ProtectedRoute";
import Activity from "./pages/Activity";
import Promotion from "./pages/Promotion";
import Wallet from "./pages/Wallet";
import Account from "./pages/Account";
import UserState from "./context/UserState";
import GiftCoupon from "./pages/activityPages/GiftCoupon";
import Attendance from "./pages/activityPages/attendance/Attendance";
import ActivityReward from "./pages/activityPages/ActivityReward";
import CollectionRecord from "./pages/activityPages/CollectionRecord";
import InvitationBonus from "./pages/activityPages/InvitationBonus";
import WinningStreak from "./pages/activityPages/WinningStreak";
import Lucky10days from "./pages/activityPages/Lucky10Days";
import SubordinateData from "./pages/promotionPages/SubordinateData";
import FirstDepositBonus from "./pages/activityPages/FirstDepositBonus";
import ActivityDetails from "./pages/activityPages/ActivityDetails";
import CommissionDetail from "./pages/promotionPages/CommissionDetail";
import LotteryCommission from "./pages/promotionPages/LotteryCommission";
import InvitationRule from "./pages/promotionPages/InvitationRule";
import NewSubordinate from "./pages/promotionPages/NewSubordinate";
import { Suspense } from "react";
import CustomerService from "./pages/accountPages/CustomerService";
import ChatZone from "./pages/accountPages/ChatZone";
import Support from "./pages/accountPages/Support";
import Notification from "./pages/accountPages/Notification";
import Feedback from "./pages/accountPages/Feedback";
import GameStatistic from "./pages/accountPages/GameStatistics";
import Language from "./pages/accountPages/Language";
import PasswordChange from "./components/account/passwordChange";
import Deposit from "./pages/walletPages/Deposit";
import USDTDepositPage from "./pages/walletPages/UsdtDepositPage";
import WithDraw from "./pages/walletPages/Withdraw";
import WingoPage from "./pages/games/WingoPage";
import FiveDPage from "./pages/games/FiveDPage";
import K3Page from "./pages/games/K3Page";
import TransactionHistory from "./pages/accountPages/TransactionHistory";
import BetHistory from "./pages/accountPages/BetHistory";
import DepositHistory from "./pages/walletPages/DepositHistory";
import WithdrawHistory from "./pages/walletPages/WithdrawHistory";
import Setting from "./pages/accountPages/Setting";
import SuperJackpot from "./pages/activityPages/SuperJackpot";
import Rule from "./pages/activityPages/Rule";
import WinningStreakRule from "./components/activity/WinningStreakRule.jsx";
import Lucky10DaysRule from "./components/activity/Lucky10DaysRule.jsx";
import WinningStar from "./pages/activityPages/WinningStar";
import GiftPackage from "./pages/activityPages/GiftPackage";
import BettingRebate from "./pages/activityPages/BettingRebate";
import AllRebateHistory from "./pages/activityPages/AllRebateHistory";
import VipPage from "./pages/accountPages/VipPage";
import AvatarChange from "./pages/accountPages/AvatarChange";
import Message from "./pages/accountPages/Message";
import AboutUs from "./pages/accountPages/AboutUs";
import LuckySpin from "./pages/games/LuckySpin";
import EventDesc from "./components/games/LuckySpin/EventDescription";
import EventDetails from "./components/games/LuckySpin/EventDetails";
import ActivityRules from "./components/games/LuckySpin/ActivityRules";
import InviteLink from "./pages/promotionPages/InviteLink";
import AddBank from "./pages/walletPages/AddBank";
import UsdtAddress from "./pages/walletPages/UsdtAddress";
import Dashboard from "./pages/admin/Dashboard";
import AdminRoute from "./components/utils/ProtectedRoutes/AdminRoute";
import TournamentManagement from "./pages/admin/TournamentManagement";
import DynamicSpinEventAdmin from "./pages/admin/DynamicSpinEventSimpleAdmin";
import DynamicSpinEvent from "./pages/DynamicSpinEvent";
import DynamicSpinEventHistory from "./pages/DynamicSpinEventHistory";
import Tournament from "./pages/Tournament";
import AllDeposit from "./pages/admin/deposit/AllDeposit";
import PendingWithdraws from "./pages/admin/withdraw/PendingWithdraws";
import PendingDepositRequest from "./pages/admin/deposit/PendingDepositRequest";
import AllWithdraws from "./pages/admin/withdraw/AllWithdraws";
import CreateGift from "./pages/admin/additional/CreateGift";
import CreateNotifications from "./pages/admin/additional/CreateNotifications";
import UpiComissionSetting from "./pages/admin/setting/UpiComissionSetting";
import WithdrawalLimitSetting from "./pages/admin/setting/WithdrawalLimitSetting";
import FirstDepositBonusSetting from "./pages/admin/setting/FirstDepositBonusSetting";
import ActivityRewardSetting from "./pages/admin/setting/ActivityRewardSetting";
import InvitationBonusSetting from "./pages/admin/setting/InvitationBonusSetting";
import ActiveUsers from "./pages/admin/manageUsers/ActiveUsers";
import UserDetails from "./pages/admin/manageUsers/UserDetails";
import BannedUsers from "./pages/admin/manageUsers/BannedUsers";
import WingoGameMonitor from "./pages/admin/manageGames/wingo/WingoGameMonitor.jsx";
import K3GameMonitor from "./pages/admin/manageGames/k3/K3GameMonitor.jsx";
import FiveDGameMonitor from "./pages/admin/manageGames/fived/FiveDGameMonitor.jsx";
import CarRaceGameMonitor from "./pages/admin/manageGames/carrace/CarRaceGameMonitor.jsx";
import IllegalBetMonitor from "./pages/admin/IllegalBetMonitor.jsx";
import AttendanceBonusSetting from "./pages/admin/setting/AttendanceBonusSetting";
import LuckyStreakSetting from "./pages/admin/setting/LuckyStreakSetting.jsx";
import LuckySpinSetting from "./pages/admin/setting/LuckySpinSetting.jsx";
import WinningStreakSetting from "./pages/admin/setting/WinningStreakSetting.jsx";
import OtherDepositSetting from "./pages/admin/setting/OtherDepositSetting.jsx";

import ProfitAndLoss from "./pages/admin/ProfitAndLoss.jsx";
import AgentPerformance from "./pages/admin/AgentPerformance.jsx";
import IPInformation from "./pages/admin/IPInformation.jsx";
import VIP from "./pages/admin/VIP.jsx";
import CreateUser from "./pages/admin/CreateUser.jsx";
import RefferalTree from "./pages/admin/RefferalTree.jsx";
import SystemSetting from "./pages/admin/SystemSetting.jsx";
import TopPerformance from "./pages/admin/TopPerformance.jsx";
import SupportTicketSystem from "./pages/admin/SupportTicketSystem.jsx";
import RefundProcess from "./pages/customerServicePages/refundPoilicy.jsx";

import CreateSalary from "./pages/admin/createSalary.jsx";
import UpdateTurnOver from "./pages/admin/UpdateTurnOver.jsx";
import EditBankDetails from "./pages/admin/manageUsers/EditBankDetails.jsx";
import InvitationRewardRules from "./pages/activityPages/InvitationRewardRules.jsx";
import InvitationRecord from "./pages/activityPages/InvitationRecord.jsx";
import GameRules from "./components/activity/GameRules.jsx";
import AttendanceHistory from "./components/activity/AttendanceHistory.jsx";
import TMSChangePassword from "./pages/customerServicePages/TMSChangePassword.jsx";
import ChangeIFSC from "./pages/customerServicePages/ChangeIFSC.jsx";
import ChangeBankName from "./pages/customerServicePages/ChangeBankName.jsx";
import ProgressQueries from "./pages/customerServicePages/ProgressQueries.jsx";
import AddUSDT from "./pages/customerServicePages/AddUSDT.jsx";
import ModifyBankDetails from "./pages/customerServicePages/ModifyBankDetails.jsx";
import ActivityBonus from "./pages/customerServicePages/ActivityBonus.jsx";
import GameProblem from "./pages/customerServicePages/GameProblem.jsx";
import Others from "./pages/customerServicePages/Others.jsx";
import DepositRechargeHistory from "./pages/customerServicePages/DepositRechargeHistory.jsx";
import DepositIssue from "./pages/customerServicePages/DepositIssue.jsx";
import WithdrawalHistory from "./pages/customerServicePages/WithdrawalHistory.jsx";
import WithdrawalIssue from "./pages/customerServicePages/WithdrawalIssue.jsx";
import BettingRecord from "./components/games/common/BettingRecord.jsx";
import CarRacingPage from "./pages/games/CarRacingPage.jsx";
import { ResponsiveRacingWrapper } from "./components/games/carRace/RacingAnimation.jsx";
import AllGamesPage from "./pages/games/AllGamesPage.jsx";
import { GameProvider } from "./context/GameContext.jsx";
import ApiTransaction from "./pages/admin/ApiTransaction.jsx";
import PvcAllGames from "./pages/games/PvcAllGames.jsx";
import SlotsAllGames from "./pages/games/SlotsAllGames.jsx";
import CustomerTelegram from "./pages/accountPages/CustomerTelegram.jsx";
import AgentPerformanceDashboard from "./pages/agentPerformancePages/AgentPerformanceDashboard.jsx";
import AgentRoute from "./components/utils/ProtectedRoutes/AgentRoute.jsx";
import { BannerPosterProvider } from "./context/BannerPosterContext.jsx";
import BannerPosterUpdate from "./pages/admin/BannerPosterUpdate.jsx";
import PushNotificationAdmin from "./pages/admin/PushNotificationAdmin.jsx";
import UPIManualDepositPage from "./pages/walletPages/UPIManualDepositPage.jsx";
import UPIManagement from "./pages/walletPages/UPIManagement.jsx";
import UPIManagementAdmin from "./pages/admin/UPIManagementAdmin.jsx";

function App() {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/racing-animation"
                element={<ResponsiveRacingWrapper />}
              />
            </Routes>
            <UserState>
              <GameProvider>
                <BannerPosterProvider>
                  <AppContent />
                </BannerPosterProvider>
              </GameProvider>
            </UserState>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return <LoadingPage />;
  }

  return (
    <>
      <Routes>
        <Route path="/register/*" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<LoadingPage />} /> */}
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/customer-telegram" element={<CustomerTelegram />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/tms/change-password" element={<TMSChangePassword />} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/activity" element={<Activity />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/tournament" element={<Tournament />} /> */}
          {/* <Route path="/dynamic-spin-event" element={<DynamicSpinEvent />} />
          <Route path="/dynamic-spin-event/history" element={<DynamicSpinEventHistory />} /> */}
          <Route path="/all-games/:id" element={<AllGamesPage />} />
          <Route path="/pvc/allgames" element={<PvcAllGames />} />
          <Route path="/all-slots/:id" element={<SlotsAllGames />} />

          {/* Activity Pages */}


          <Route path="/gift-coupon" element={<GiftCoupon />} />
          <Route path="/attendance" element={<Attendance />} />
          {/* <Route
            path="/activity/activity-reward"
            element={<ActivityReward />}
          /> */}
          <Route
            path="/activity/activity-reward/collection-record"
            element={<CollectionRecord />}
          />
          {/* <Route
            path="/activity/invitation-bonus"
            element={<InvitationBonus />}
          /> */}
          {/* <Route path="/activity/winning-streak" element={<WinningStreak />} />
          <Route path="/activity/lucky-10days" element={<Lucky10days />} /> */}
          <Route
            path="/activity/first-deposit-bonus"
            element={<FirstDepositBonus />}
          />
          <Route
            path="/activity/activity-details/:id"
            element={<ActivityDetails />}
          />
          <Route path="/activity/super-jackpot" element={<SuperJackpot />} />
          <Route path="/activity/super-jackpot/rule" element={<Rule />} />
          <Route
            path="/activity/winning-streak/rule"
            element={<WinningStreakRule />}
          />
          <Route
            path="/activity/lucky-10days/rule"
            element={<Lucky10DaysRule />}
          />
          <Route
            path="/activity/super-jackpot/winning-star"
            element={<WinningStar />}
          />
          <Route path="/activity/gift-package" element={<GiftPackage />} />
          <Route path="/activity/betting-rebate" element={<BettingRebate />} />
          <Route
            path="/activity/betting-rebate-History"
            element={<AllRebateHistory />}
          />
          <Route
            path="/activity/invitation-reward-rules"
            element={<InvitationRewardRules />}
          />
          <Route
            path="/activity/invitation-record"
            element={<InvitationRecord />}
          />
          <Route path="/activity/games-rule" element={<GameRules />} />
          <Route
            path="/activity/attendance/history"
            element={<AttendanceHistory />}
          />

          {/* Lottery Games Routes */}
          <Route path="/home/AllLotteryGames">
            {/* Wingo Routes */}
            <Route path="wingo">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            {/* K3 Routes */}
            <Route path="k3">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            <Route path="5d">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            <Route path="car-race">
              <Route path="BettingRecordWin" element={<BettingRecord />} />
            </Route>

            {/* Dynamic route for any game's betting records */}
            <Route
              path=":gameType/BettingRecordWin"
              element={<BettingRecord />}
            />
          </Route>

          {/* Promotion Pages */}

          <Route
            path="/promotion/subordinate-data"
            element={<SubordinateData />}
          />
          <Route
            path="/promotion/commission-detail"
            element={<CommissionDetail />}
          />
          <Route
            path="/promotion/commission-detail/lottery-commission"
            element={<LotteryCommission />}
          />
          <Route
            path="/promotion/invitation-rule"
            element={<InvitationRule />}
          />
          <Route
            path="/promotion/new-subordinate"
            element={<NewSubordinate />}
          />
          <Route path="/promotion/invite-link" element={<InviteLink />} />

          {/* Account Pages */}

          <Route
            path="/account/transaction-history"
            element={<TransactionHistory />}
          />
          <Route path="/account/vip" element={<VipPage />} />
          <Route path="/account/bet-history" element={<BetHistory />} />
          <Route path="/account/avatar-change" element={<AvatarChange />} />
          <Route path="/account/support" element={<Support />} />
          <Route path="/account/chat-zone" element={<ChatZone />} />
          <Route path="/account/settings" element={<Setting />} />
          <Route
            path="/account/settings/PasswordChange"
            element={<PasswordChange />}
          />
          <Route path="/account/feedback" element={<Feedback />} />
          <Route path="/account/notification" element={<Notification />} />
          <Route path="/account/game-statistic" element={<GameStatistic />} />
          <Route path="/account/language" element={<Language />} />
          <Route path="/account/message" element={<Message />} />
          <Route path="/account/about-us" element={<AboutUs />} />

          {/* Wallet Pages */}

          <Route path="/wallet/deposit" element={<Deposit />} />
          <Route
            path="/usdt-deposit/:randomId/:timestamp"
            element={<USDTDepositPage />}
          />
          <Route
            path="/upi-deposit/:id1/:id2"
            element={<UPIManualDepositPage />}
          />

          <Route path="/deposit-history" element={<DepositHistory />} />
          <Route path="/withdraw-history" element={<WithdrawHistory />} />
          <Route path="/wallet/withdraw" element={<WithDraw />} />
          <Route path="/wallet/withdraw/add-bank" element={<AddBank />} />
          <Route
            path="/wallet/withdraw/usdtaddress"
            element={<UsdtAddress />}
          />
          <Route path="/upi-management" element={<UPIManagement />} />

          {/* Lottery Games route */}
          <Route path="/timer" element={<WingoPage />} />
          <Route path="/k3" element={<K3Page />} />
          <Route path="/5d" element={<FiveDPage />} />
          <Route path="/car-race" element={<CarRacingPage />} />

          {/* <Route path="/lucky-spinner" element={<LuckySpin />} /> */}
          <Route path="/lucky-spinner/event-desc" element={<EventDesc />} />
          <Route
            path="/lucky-spinner/event-details"
            element={<EventDetails />}
          />
          <Route
            path="/lucky-spinner/activity-rules"
            element={<ActivityRules />}
          />
        </Route>
        <Route
          path="/tms/deposit-recharge-history"
          element={<DepositRechargeHistory />}
        />
        <Route path="/tms/deposit-issue" element={<DepositIssue />} />

        <Route path="/tms/withdrawal-history" element={<WithdrawalHistory />} />
        <Route path="/tms/withdrawal-issue" element={<WithdrawalIssue />} />

        <Route path="/tms/change-ifsc" element={<ChangeIFSC />} />
        <Route path="/tms/change-bank-name" element={<ChangeBankName />} />
        <Route path="/tms/change-usdt" element={<AddUSDT />} />
        <Route
          path="/tms/modify-bank-details"
          element={<ModifyBankDetails />}
        />
        <Route path="/tms/activity-bonus" element={<ActivityBonus />} />
        <Route path="/tms/game-problem" element={<GameProblem />} />
        <Route path="/tms/others-issue" element={<Others />} />
        <Route path="/tms/refund-policy" element={<RefundProcess />} />

        <Route path="/tms/progress-query" element={<ProgressQueries />} />
        {/* Admin Authenticated Routes */}

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* <Route path="/admin/tournament-management" element={<TournamentManagement />} /> */}
          {/* <Route path="/admin/dynamic-spin-event" element={<DynamicSpinEventAdmin />} /> */}
          <Route
            path="/admin/pending-deposit"
            element={<PendingDepositRequest />}
          />
          <Route path="/admin/all-deposit" element={<AllDeposit />} />
          <Route
            path="/admin/pending-withdraw"
            element={<PendingWithdraws />}
          />
          <Route path="/admin/all-withdraw" element={<AllWithdraws />} />

          <Route path="/admin/create-giftcode" element={<CreateGift />} />
          {/* <Route
            path="/admin/create-notifications"
            element={<CreateNotifications />}
          /> */}
          <Route
            path="/admin/push-notifications"
            element={<PushNotificationAdmin />}
          />

          <Route path="/admin/upi-setting" element={<UpiComissionSetting />} />
          {/* <Route
            path="/admin/withdrawal-setting"
            element={<WithdrawalLimitSetting />}
          /> */}
          {/* <Route
            path="/admin/lucky-streak-setting"
            element={<LuckyStreakSetting />}
          /> */}
          {/* <Route path="/admin/lucky-spin" element={<LuckySpinSetting />} /> */}
          {/* <Route
            path="/admin/winning-streak-setting"
            element={<WinningStreakSetting />}
          /> */}
          <Route
            path="/admin/first-deposit-setting"
            element={<FirstDepositBonusSetting />}
          />
          <Route
            path="/admin/other-deposit-setting"
            element={<OtherDepositSetting />}
          />
          {/* <Route
            path="/admin/activity-reward"
            element={<ActivityRewardSetting />}
          />
          <Route
            path="/admin/invitation-bonus"
            element={<InvitationBonusSetting />}
          />
          <Route
            path="/admin/attendance-bonus"
            element={<AttendanceBonusSetting />}
          /> */}

          <Route path="/admin/active-users" element={<ActiveUsers />} />
          {/* <Route path="/admin/banned-users" element={<BannedUsers />} /> */}
          <Route path="/admin/user-details/:id" element={<UserDetails />} />
          {/* <Route path="/admin/edit-bank-detail" element={<EditBankDetails />} /> */}
          {/* <Route path="/admin/upi-management" element={<UPIManagementAdmin />} /> */}

          {/* <Route path="/admin/create-salary" element={<CreateSalary />} /> */}
          {/* <Route path="/admin/update-turn-over" element={<UpdateTurnOver />} /> */}

          {/* Games management */}
          <Route path="/admin/wingo-admin" element={<WingoGameMonitor />} />
          <Route path="/admin/k3-admin" element={<K3GameMonitor />} />
          <Route path="/admin/fived-admin" element={<FiveDGameMonitor />} />
          {/* <Route
            path="/admin/car-race-admin"
            element={<CarRaceGameMonitor />}
          /> */}

          {/* Illegal Bet Monitor */}
          {/* <Route path="/admin/illegal-bets" element={<IllegalBetMonitor />} /> */}

          {/* Profit and Loss */}
          {/* <Route path="/admin/profit-loss" element={<ProfitAndLoss />} />
          <Route
            path="/admin/agent-performance"
            element={<AgentPerformance />}
          />
          <Route path="/admin/ip-tracking" element={<IPInformation />} />
          <Route path="/admin/top-performance" element={<TopPerformance />} /> */}
          <Route path="/admin/api-transaction" element={<ApiTransaction />} />

          {/* VIP Page */}
          <Route path="/admin/vip-levels" element={<VIP />} />
          {/* <Route path="/admin/create-user" element={<CreateUser />} /> */}
          <Route path="/admin/referral-tree" element={<RefferalTree />} />
          <Route path="/admin/system-setting" element={<SystemSetting />} />
          {/* <Route
            path="admin/support-system"
            element={<SupportTicketSystem />}
          /> */}

          {/* Banner Poster Update */}
          {/* <Route path="admin/banner-poster-update" element={<BannerPosterUpdate />} /> */}
        </Route>
        <Route element={<AgentRoute />}>
          <Route
            path="/agent/agent-dashboard"
            element={<AgentPerformanceDashboard />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
