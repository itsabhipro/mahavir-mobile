import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CustomerWorkPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please sign in</h2>
        <p className="mt-2 text-slate-600">You need to be logged in to view your work.</p>
        <Link href="/auth/login" className="mt-4 inline-block rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">
          Sign In
        </Link>
      </div>
    );
  }

  // Fetch real orders data as projects from database
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      card_type_id,
      quantity,
      status,
      payment_status,
      expected_delivery_date,
      created_at,
      shipping_full_name,
      marriage_card_type_details (
        name,
        card_type
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  // Map orders to projects
  const projects = orders?.map(order => {
    // Determine project type based on card type
    const cardType = order.marriage_card_type_details?.[0]?.card_type || 'Normal';
    const projectType = cardType === 'Normal' ? 'Printing' : 'Design';
    
    // Map order status to project status
    let projectStatus = 'Pending';
    let progress = 30;
    
    switch (order.status) {
      case 'pending':
        projectStatus = 'Pending';
        progress = 20;
        break;
      case 'confirmed':
        projectStatus = 'Confirmed';
        progress = 40;
        break;
      case 'processing':
        projectStatus = 'Processing';
        progress = 50;
        break;
      case 'printing':
        projectStatus = 'Printing';
        progress = 75;
        break;
      case 'ready_for_delivery':
        projectStatus = 'Ready';
        progress = 90;
        break;
      case 'shipped':
        projectStatus = 'Shipped';
        progress = 95;
        break;
      case 'delivered':
        projectStatus = 'Completed';
        progress = 100;
        break;
      case 'cancelled':
        projectStatus = 'Cancelled';
        progress = 0;
        break;
      default:
        projectStatus = 'Pending';
        progress = 30;
    }

    return {
      id: order.id,
      name: order.marriage_card_type_details?.[0]?.name || 'Card Design',
      type: projectType,
      status: projectStatus,
      due: order.expected_delivery_date || '2025-03-15',
      progress: progress,
      order_number: order.order_number,
      quantity: order.quantity,
      created_at: order.created_at,
    };
  }) || [];

  // Calculate statistics from real data
  const activeProjects = projects.filter(p => 
    !['Completed', 'Cancelled'].includes(p.status)
  ).length;
  const completedProjects = projects.filter(p => 
    p.status === 'Completed'
  ).length;
  const pendingReviewProjects = projects.filter(p => 
    ['Pending', 'Confirmed'].includes(p.status)
  ).length;
  
  // Calculate overdue projects (due date passed and not completed)
  const today = new Date().toISOString().split('T')[0];
  const overdueProjects = projects.filter(p => 
    p.due < today && p.status !== 'Completed'
  ).length;

  const statusColor = (status: string) => {
    switch (status) {
      case "Processing":
      case "Printing":
      case "Ready":
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Work</h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Manage your design projects and printing work</p>
        </div>
        <Link
          href="/customer/order/new"
          className="w-full sm:w-auto rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 text-center"
        >
          + New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Active Projects</p>
          <p className="text-2xl font-bold">{activeProjects}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold">{completedProjects}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-2xl font-bold">{pendingReviewProjects}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className="text-2xl font-bold">{overdueProjects}</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-slate-500">ID: PROJ-{project.id.toString().padStart(3, '0')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                      {project.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${project.due < '2025-03-01' ? 'text-red-600' : 'text-slate-900'}`}>
                      {project.due}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/customer/work/${project.id}`}
                        className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                      >
                        View
                      </Link>
                      <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <span className="text-blue-600">📋</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Design approved for Wedding Card Design</p>
              <p className="text-sm text-slate-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <span className="text-green-600">✅</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{'Invitation Cards'} project completed</p>
              <p className="text-sm text-slate-500">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <span className="text-yellow-600">💬</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">New comment on {'Business Cards'}</p>
              <p className="text-sm text-slate-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <span className="text-3xl">📎</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Upload Design Files</h3>
        <p className="mt-1 text-sm text-slate-600">Upload images, PDFs, or design files for your projects</p>
        <div className="mt-6">
          <label className="cursor-pointer">
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 hover:border-slate-400">
              <div className="text-4xl">⬆️</div>
              <p className="mt-2 text-sm font-medium text-slate-700">Click to browse files</p>
              <p className="text-xs text-slate-500">or drag and drop</p>
              <p className="mt-2 text-xs text-slate-500">Supports JPG, PNG, PDF, AI up to 10MB</p>
            </div>
            <input type="file" className="hidden" multiple />
          </label>
        </div>
        <button className="mt-6 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800">
          Upload Files
        </button>
      </div>
    </div>
  );
}